import { Tabs } from "expo-router";
import { AlarmClock } from "@/components/common/Icons";
import { useColorScheme } from "@/lib/useColorScheme";
import { PenBox } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { BlurView } from 'expo-blur';


export default function TabLayout() {
  const { colors, isDarkColorScheme } = useColorScheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.foreground,
      tabBarStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        borderTopWidth: 0,
        paddingTop: 8,
        height: 80,
      },
      tabBarBackground: () => (
        <View style={{
          flex: 1, overflow: 'hidden',
          boxShadow: 'inset 0 0px 0px, 0 3px 5px',
        }}
          className="rounded-md">
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkColorScheme
                ? 'rgba(0,0,0,0.5)'
                : 'rgba(255,255,255,0.5)'
            }
          ]} />
        </View>
      ),

    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AlarmClock size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <PenBox size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
