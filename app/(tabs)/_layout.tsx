import { Tabs } from "expo-router";
import { AlarmClock } from "@/components/Icons";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Alarms",
          tabBarIcon: () => <AlarmClock size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
