import { Tabs } from "expo-router";
import { AlarmClock } from "@/components/common/Icons";
import { useColorScheme } from "@/lib/useColorScheme";
import { PenBox } from "lucide-react-native";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from 'expo-blur';


export default function TabLayout() {
  const { colors, isDarkColorScheme } = useColorScheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: isDarkColorScheme ? "hsl(0 0% 70%)" : "hsl(0 0% 50%)", // temporary until we have a full color system
      tabBarStyle: {
        backgroundColor: 'transparent',
        position: 'absolute',
        borderTopWidth: 0,
        paddingTop: 10,
        height: 85,
      },
      tabBarBackground: () => (
        <View style={{
          flex: 1, overflow: 'hidden',
          boxShadow: `inset 0 0px 0px, 0 3px ${isDarkColorScheme ? "6px" : "5px"} ${colors.foreground}`, // temporary until we have a full color system
        }}
          className="rounded-md">
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod="dimezisBlurView"
          />
          <View style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkColorScheme
                ? 'rgba(0,0,0,0.5)' // temporary until we have a full color system but will try to keep it just like this
                : Platform.OS === 'ios' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' // temporary until we have a full color system, a proper screen and filled icons to test the contrast on so we can adjust the white value to see how less whte we can keep
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
      <Tabs.Screen
        name="test copy"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <PenBox size={24} color={color} />
          ),
        }}
      />      <Tabs.Screen
        name="test copy 2"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <PenBox size={24} color={color} />
          ),
        }}
      />      <Tabs.Screen
        name="test copy 3"
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
//TODO: test on android
