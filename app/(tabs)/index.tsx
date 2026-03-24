import { AlarmCard } from '@/components/alarms/alarm-list';
import { Text } from '@/components/common/Text';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { db } from '@/db/drizzle';
import { AlarmsTable } from '@/db/schema';
import { useColorScheme } from '@/lib/useColorScheme';
import { EllipsisVertical, Plus } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { useDatabase } from '@/db/provider';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { formatCountdown, getNextOccurrence, updateAlarm } from '@/lib/alarms';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';

type Props = {};
export default function Alarms({}: Props) {
  // STATE
  const [currentTime, setCurrentTime] = useState(new Date());

  // HOOKS
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { colors } = useColorScheme();

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 15, // change this later if needed
    stiffness: 200, // change this later if needed
    mass: 0.4, // change this later if needed
  });

  // DATA
  const { data: alarms } = useLiveQuery(db.select().from(AlarmsTable));
  const { db: database } = useDatabase();

  // DERIVED
  const alarmsWithNext = alarms
    .filter((alarm) => alarm.isActive)
    .map((alarm) => ({ alarm, next: getNextOccurrence(alarm) }));

  const nextAlarmWithNext = alarmsWithNext
    .filter(({ next }) => next !== null)
    .sort((a, b) => a.next!.getTime() - b.next!.getTime())[0];

  const nextAlarm = nextAlarmWithNext?.alarm ?? null;
  const nextOccurrence = nextAlarmWithNext?.next ?? null;
  const timeTillNextAlarm = nextOccurrence ? formatCountdown(nextOccurrence, currentTime) : null;
  const isTimeBased = timeTillNextAlarm?.includes('m') || timeTillNextAlarm?.includes('h');

  // EFFECTS
  useEffect(() => {
    alarmsWithNext
      .filter(({ next }) => next === null)
      .forEach(({ alarm }) => updateAlarm(alarm.id, { isActive: false }));
  }, [alarms]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // IF'S
  if (!database) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ThemeToggle />
      <View className="items-center justify-center py-8" style={{ height: 195 }}>
        {nextAlarm ? (
          <>
            <Text className="text-base tracking-widest text-muted-foreground">
              NEXT ALARM {isTimeBased && 'IN'}
            </Text>
            <Text
              className={`-my-1 ${isTimeBased ? 'text-6xl' : 'text-5xl'} leading-snug tracking-widest text-foreground`}
              font="Poppins_700Bold">
              {timeTillNextAlarm}
            </Text>
            <Text className="text-xl text-muted-foreground">
              {formatTime(nextAlarm.time)} · {nextAlarm.label}
            </Text>
            {/* add some subtle teal hint */}
          </>
        ) : (
          <Text className="text-xl text-muted-foreground">No active alarms</Text>
        )}
      </View>
      {/* <View className="w-[90%] mx-auto h-[1px] bg-muted" /> */}

      <View className="w-full flex-row items-center justify-between px-3.5">
        <Text className="pl-2.5 text-2xl" font="Poppins_600SemiBold">
          Alarms
        </Text>
        <View className="flex-row items-center justify-end gap-2.5">
          <Button
            onPress={() => bottomSheetRef.current?.present()}
            variant="ghost"
            className="h-8 w-8 bg-card shadow-sm shadow-black/5">
            <Plus color={colors.foreground} size={20} />
          </Button>
          <Button variant="ghost" className="h-8 w-8 bg-card shadow-sm shadow-black/5">
            <EllipsisVertical color={colors.foreground} size={20} />
          </Button>
        </View>
      </View>
      <ScrollView
        contentContainerClassName="gap-2.5"
        className="mt-2.5 flex-1 bg-background px-2.5">
        {alarms.map((alarm) => (
          <AlarmCard key={alarm.id} alarm={alarm} />
        ))}
        {/* add some subtle teal hint */}
      </ScrollView>
      <BottomSheetModal
        handleIndicatorStyle={{
          backgroundColor: colors.mutedForeground,
          width: 60, // change this later if needed
          height: 3, // change this later if needed
          borderRadius: 10, // change this later if needed
        }}
        backgroundStyle={{
          borderRadius: 12,
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        }}
        ref={bottomSheetRef}
        snapPoints={['93.5%']} // change this later if needed
        enableDynamicSizing={false}
        enablePanDownToClose
        overDragResistanceFactor={1}
        enableOverDrag
        backdropComponent={(props) => {
          return (
            <BottomSheetBackdrop
              {...props}
              opacity={0.5}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          );
        }}
        animationConfigs={animationConfigs}>
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          <Text>Test Bottom Sheet</Text>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
