import { Text } from "@/components/common/Text";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useColorScheme } from "@/lib/useColorScheme";
import { EllipsisVertical, Plus } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type Props = {};
export default function Alarms({ }: Props) {
  const { colors } = useColorScheme()
  const [isOn, setIsOn] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-background" >
      <ThemeToggle />
      <View className="items-center justify-center gap-2 pt-16 pb-8">
        <Text className="text-base text-muted-foreground">Time until next alarm</Text>
        <Text className="text-4xl font-bold text-foreground -mb-3" font="Poppins_600SemiBold">8h 15m</Text>
        <Text className="text-xl text-primary">7:00 AM</Text>
      </View>
      {/* <View className="w-[90%] mx-auto h-[1px] bg-muted" /> */}

      <View className="px-2.5 w-full" >
        <View className="items-center justify-end flex-row gap-2.5 pt-4">
          <Button variant="outline" className="w-8 h-8 bg-card" ><Plus color={colors.foreground} size={20} /></Button>
          <Button variant="outline" className="w-8 h-8 bg-card" ><EllipsisVertical color={colors.foreground} size={20} /></Button>
        </View>
      </View>
      <ScrollView contentContainerClassName="gap-2.5" className="flex-1 px-2  bg-background mt-2.5">
        <Card className="bg-card py-2" >
          <CardContent className="flex-row items-center justify-between">
            <View className="flex justify-center items-start ">
              <Text className="text-sm text-muted-foreground mb-2">Eid</Text>
              <Text className="text-3xl font-bold text-foreground" font="Poppins_600SemiBold">7:00 AM</Text>
              <Text className="text-sm text-muted-foreground">Once</Text>
            </View>
            <Switch className="scale-[1.4] " checked={isOn} onCheckedChange={() => setIsOn(!isOn)} />
          </CardContent>

        </Card>
        <Card className="bg-card py-2 opacity-50" >
          <CardContent className="flex-row items-center justify-between">
            <View className="flex justify-center items-start ">
              <Text className="text-sm text-muted-foreground mb-2">Alarm</Text>
              <Text className="text-3xl font-bold text-foreground" font="Poppins_600SemiBold">7:00 AM</Text>
              <Text className="text-sm text-muted-foreground">Once</Text>
            </View>
            <Switch className="scale-[1.4] " checked={false} onCheckedChange={() => { }} />
          </CardContent>

        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
