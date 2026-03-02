import { Tabs } from "expo-router";
import { AlarmClock } from "@/components/Icons";
import { useColorScheme } from "@/lib/useColorScheme";
import { PenBox } from "lucide-react-native";


export default function TabLayout() {
  const { colors } = useColorScheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: () => <AlarmClock size={24} color={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "",
          tabBarIcon: () => <PenBox size={20} />,
        }}
      />
    </Tabs>
  );
}
