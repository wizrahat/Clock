import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { COLORS } from "@/lib/constants";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  return {
    colors: COLORS[colorScheme ?? "dark"],
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
