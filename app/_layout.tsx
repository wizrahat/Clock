import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatabaseProvider } from "@/db/provider";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { useColorScheme } from "@/lib/useColorScheme";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { useEffect } from "react";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "@/lib/theme";
import { getItem, setItem } from "@/lib/storage";
import { PortalHost } from "@rn-primitives/portal";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const theme = getItem("theme");
    if (!theme) {
      setItem("theme", colorScheme);
    }
    const colorTheme =
      theme === "light" || theme === "dark" ? theme : colorScheme;
    setColorScheme(colorTheme);
    setAndroidNavigationBar(colorTheme);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <DatabaseProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <GestureHandlerRootView
          style={{ flex: 1 }}
          className={colorScheme === "dark" ? "dark" : ""}
        >
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{ title: "Alarms", headerShown: false }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
        <PortalHost />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
