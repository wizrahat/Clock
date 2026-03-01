import { Tabs } from "expo-router";
import { AlarmClock } from "@/components/Icons";
import { useColorScheme } from "@/lib/useColorScheme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  const { colors } = useColorScheme();
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: () => <AlarmClock size={24} color={colors.foreground} />,
        }}
      />
    </Tabs>
  );
}
