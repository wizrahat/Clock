import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { THEME } from "@/lib/theme";

export async function setAndroidNavigationBar(theme: "light" | "dark") {
  if (Platform.OS !== "android") return;
  await NavigationBar.setButtonStyleAsync(theme === "dark" ? "light" : "dark");
  await NavigationBar.setBackgroundColorAsync(
    theme === "dark" ? THEME.dark.background : THEME.light.background,
  );
}
