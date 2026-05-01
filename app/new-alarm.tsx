import { ScheduleCard, TimePicker } from '@/components/alarms/new-alarm';
import { useColorScheme } from '@/lib/useColorScheme';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function NewAlarmScreen() {
  const { colors } = useColorScheme();
  const insets = useSafeAreaInsets();

  const [ready, setReady] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.97);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
      opacity.value = withTiming(1, { duration: 1000, easing: Easing.bezierFn(0.25, 1, 0.5, 1) });
      scale.value = withTiming(1, { duration: 1000, easing: Easing.bezierFn(0.25, 1, 0.5, 1) });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      <View
        style={{ width: 80, height: 3, borderRadius: 10, alignSelf: 'center' }}
        className="mt-3 bg-muted-foreground"
      />
      {ready && (
        <Animated.ScrollView
          style={animatedStyle}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 15,
            gap: 10,
            paddingBottom: insets.bottom + 20,
          }}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}>
          <TimePicker />
          <ScheduleCard />
        </Animated.ScrollView>
      )}
    </View>
  );
}
