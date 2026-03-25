import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SPRING_CONFIG = {
  damping: 16,
  stiffness: 320,
  mass: 0.4,
};

function Switch({
  className,
  ...props
}: SwitchPrimitives.RootProps & React.RefAttributes<SwitchPrimitives.RootRef>) {
  const progress = useSharedValue(props.checked ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(props.checked ? 1 : 0, SPRING_CONFIG);
  }, [props.checked]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [0, 14]) }],
  }));

  return (
    <SwitchPrimitives.Root
      className={cn(
        'flex h-[1.15rem] w-8 shrink-0 flex-row items-center rounded-full border border-transparent shadow-sm shadow-black/5',
        Platform.select({
          web: 'focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        props.checked ? 'bg-primary' : 'dark:bg-input/80 bg-input',
        props.disabled && 'opacity-50',
        className
      )}
      {...props}>
      <Animated.View
        className={cn(
          'size-4 rounded-full bg-background dark:bg-foreground',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          })
        )}
        style={thumbStyle}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
