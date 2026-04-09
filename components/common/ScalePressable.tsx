import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

const defaultSpringConfig = {
  damping: 20,
  stiffness: 300,
  mass: 0.2,
};

export default function ScalePressable({
  children,
  onPress,
  scaleValue = 0.9,
  springConfig = defaultSpringConfig,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  scaleValue?: number;
  springConfig?: SpringConfig;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(scaleValue, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
