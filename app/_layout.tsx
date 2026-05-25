import './global.css';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@react-navigation/native';
import { Easing, interpolate } from 'react-native-reanimated';

import { DatabaseProvider } from '@/db/provider';
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar';
import { useColorScheme } from '@/lib/useColorScheme';
import { NAV_THEME } from '@/lib/theme';
import { getItem, setItem } from '@/lib/storage';
import { PortalHost } from '@rn-primitives/portal';

import { Stack } from '@/components/common/Stack';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const theme = getItem('theme');
    if (!theme) {
      setItem('theme', colorScheme);
      return;
    }
    const colorTheme = theme === 'light' || theme === 'dark' ? theme : colorScheme;
    setColorScheme(colorTheme);
    setAndroidNavigationBar(colorTheme);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => SplashScreen.hideAsync(), 50);
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <DatabaseProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <GestureHandlerRootView
          style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#F2F2F7' }}
          className={colorScheme === 'dark' ? 'dark' : ''}>
          <Stack>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="new-alarm"
              options={{
                snapPoints: [0.94],
                initialSnapIndex: 0,

                gestureDirection: 'vertical',
                gestureEnabled: true,
                gestureActivationArea: {
                  top: 'edge',
                },

                screenStyleInterpolator: ({
                  progress,
                  layouts: { screen },
                  insets,
                  active,
                }: any) => {
                  'worklet';

                  const scale = interpolate(progress, [0, 1, 2], [1, 1, 0.96], 'clamp');

                  const translateY = interpolate(
                    progress,
                    [0, 1, 2],
                    [screen.height, 0, insets.top - 14],
                    'clamp'
                  );

                  const borderRadius = interpolate(progress, [0, 1, 2], [0, 36, 36], 'clamp');

                  const overdrag = Math.min(0, active?.gesture?.y ?? 0) / 15;

                  return {
                    contentStyle: {
                      transform: [{ scale }, { translateY: translateY + overdrag }],
                      borderRadius,
                      overflow: 'hidden',
                      backgroundColor: '#121212', // temporary
                    },
                    backdropStyle: {
                      backgroundColor: 'rgba(0,0,0,0.3)', // temporary
                      opacity: interpolate(progress, [0, 1], [0, 0.5]),
                    },
                  };
                },

                transitionSpec: {
                  open: {
                    duration: 450,
                    easing: Easing.bezierFn(0.36, 0.66, 0.04, 1),
                  },
                  close: {
                    duration: 380,
                    easing: Easing.bezierFn(0.36, 0.66, 0.04, 1),
                  },
                },
              }}
            />
          </Stack>
        </GestureHandlerRootView>
        <PortalHost />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
