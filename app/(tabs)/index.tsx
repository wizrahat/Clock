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
import { formatTime, getTimeTillNext } from "@/lib/utils";
import { useDatabase } from "@/db/provider";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";


type Props = {};
export default function Alarms({ }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date())

  const { data: alarms } = useLiveQuery(db.select().from(AlarmsTable))
  const { colors } = useColorScheme();
  const { db: database } = useDatabase()

  const nextAlarm = alarms.filter(alarm => alarm.isActive).sort((a, b) => a.time - b.time)[0];
  const timeTillNextAlarm = nextAlarm ? getTimeTillNext(nextAlarm.time, currentTime) : null

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!database) return null


  return (
    <SafeAreaView className="flex-1 bg-background" >
      <ThemeToggle />
      <View className="items-center justify-center gap-2.5 pt-16 pb-8">
        {nextAlarm ? (<><Text className="text-base text-muted-foreground">Next alarm</Text>
          <Text className="text-4xl font-bold text-foreground -mb-2.5" font="Poppins_600SemiBold">{timeTillNextAlarm}</Text>
          <Text className="text-xl text-primary" font="Poppins_500Medium">{formatTime(nextAlarm.time)} · {nextAlarm.label}</Text>  {/* add some subtle teal hint */}
        </>) :
          (<Text>No active alarms</Text>)}

      </View>
      {/* <View className="w-[90%] mx-auto h-[1px] bg-muted" /> */}

      <View className="px-3.5 w-full  flex-row items-center justify-between" >
        <Text font="Poppins_500Medium" className="text-2xl pl-2.5">Alarms</Text>
        <View className="items-center justify-end flex-row gap-2.5">
          <Button variant="ghost" className="w-8 h-8 bg-card shadow-sm shadow-black/5" ><Plus color={colors.foreground} size={20} /></Button>
          <Button variant="ghost" className="w-8 h-8 bg-card shadow-sm shadow-black/5" ><EllipsisVertical color={colors.foreground} size={20} /></Button>
        </View>
      </View>
      <ScrollView contentContainerClassName="gap-2.5" className="flex-1 px-2.5  bg-background mt-2.5">
        {alarms.map(alarm => <AlarmCard key={alarm.id} alarm={alarm} />)} {/* add some subtle teal hint */}
      </ScrollView>
    </SafeAreaView>
  );
}
