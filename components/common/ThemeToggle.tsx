import { setItem, storage } from "@/lib/storage";
import { Pressable, View } from "react-native";
import { MoonStar, Sun } from "@/components/common/Icons";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { isDarkColorScheme, toggleColorScheme, colorScheme } =
    useColorScheme();

  const handleToggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    toggleColorScheme();
    setAndroidNavigationBar(newTheme);
    setItem("theme", newTheme);
  };
  return (
    <Pressable
      onPress={() => handleToggleTheme()}
      className="ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {({ pressed }) => (
        <View
          className={cn(
            "flex-1 aspect-square pt-0.5 justify-center items-start web:px-5",
            pressed && "opacity-70",
          )}
        >
          {isDarkColorScheme ? (
            <MoonStar className="text-foreground" size={23} />
          ) : (
            <Sun className="text-foreground" size={24} />
          )}
        </View>
      )}
    </Pressable>
  );
}
