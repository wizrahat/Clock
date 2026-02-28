import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { COLORS } from "@/lib/theme/colors";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();

  return {
    colors: COLORS[colorScheme ?? "light"],
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme: colorScheme === "light",
    setColorScheme,
    toggleColorScheme,
  };
}
