import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  return {
    colors: THEME[colorScheme ?? "light"],
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme: colorScheme === "light",
    setColorScheme,
    toggleColorScheme,
  };
}
