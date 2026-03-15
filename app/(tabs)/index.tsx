import { AlarmCard } from "@/components/alarms/alarm-list";
import { Text } from "@/components/common/Text";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { db } from "@/db/drizzle";
import { AlarmsTable } from "@/db/schema";
import { useColorScheme } from "@/lib/useColorScheme";
import { EllipsisVertical, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { addDays, differenceInMinutes, parse } from "date-fns";
import { getTimeTillNext } from "@/lib/utils";


type Props = {};
export default function Alarms({ }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date())

  const { colors } = useColorScheme();

  const alarms = db.select().from(AlarmsTable).all();

  const nextAlarm = alarms.filter(alarm => alarm.isActive).sort((a, b) => a.time - b.time)[0];
  const timeTillNextAlarm = getTimeTillNext(nextAlarm.time, currentTime)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" >
      <ThemeToggle />
      <View className="items-center justify-center gap-2 pt-16 pb-8">
        <Text className="text-base text-muted-foreground">Time until next alarm</Text>
        <Text className="text-4xl font-bold text-foreground -mb-3" font="Poppins_600SemiBold">{timeTillNextAlarm}</Text>
        <Text className="text-xl text-primary">{nextAlarm.time}</Text>
      </View>
      {/* <View className="w-[90%] mx-auto h-[1px] bg-muted" /> */}

      <View className="px-2.5 w-full" >
        <View className="items-center justify-end flex-row gap-2.5 pt-4">
          <Button variant="outline" className="w-8 h-8 bg-card" ><Plus color={colors.foreground} size={20} /></Button>
          <Button variant="outline" className="w-8 h-8 bg-card" ><EllipsisVertical color={colors.foreground} size={20} /></Button>
        </View>
      </View>
      <ScrollView contentContainerClassName="gap-2.5" className="flex-1 px-2  bg-background mt-2.5">
        {alarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
