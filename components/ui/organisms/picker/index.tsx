import React, { memo, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const LOOP_ITERATIONS = 100;

export const Picker = memo(
  ({
    items,
    onItemChange,
    initialIndex = 0,
    itemHeight = 64,
    rowGap = 0,
    fontSize = 32,
    width = 85,
    loop = true,
    textColor = '#FFFFFF',
    font = 'Poppins_500Medium',
    fontWeight = '700',
    deceleration = 0.998,
  }: any) => {
    const count = items.length;
    const effectiveItemHeight = itemHeight + rowGap;
    const pickerHeight = effectiveItemHeight * 5;
    const scrollY = useSharedValue(0);
    const flatListRef = useRef<Animated.FlatList<string>>(null);
    const lastIndex = useRef(initialIndex);
    const soundRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
      async function setupAudio() {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
          });
          const { sound } = await Audio.Sound.createAsync(require('@/assets/sounds/tick.wav'));
          soundRef.current = sound;
        } catch (e) {
          console.warn('Sound load failed.');
        }
      }
      setupAudio();
      return () => {
        soundRef.current?.unloadAsync();
      };
    }, []);

    const playFeedback = useCallback(async () => {
      if (!soundRef.current) return;
      try {
        await soundRef.current.replayAsync();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e) {}
    }, []);

    const data = useMemo(() => {
      return loop
        ? Array.from({ length: count * LOOP_ITERATIONS }, (_, i) => items[i % count])
        : items;
    }, [items, loop, count]);

    const midPoint = loop ? count * (LOOP_ITERATIONS / 2) : 0;

    useEffect(() => {
      const offset = (midPoint + initialIndex) * effectiveItemHeight;
      scrollY.value = offset;
      flatListRef.current?.scrollToOffset({ offset, animated: false });
    }, [initialIndex]);

    const handleIndexChange = (offset: number) => {
      const index = Math.round(offset / effectiveItemHeight);
      const normalizedIndex = loop ? index % count : index;

      if (
        normalizedIndex !== lastIndex.current &&
        normalizedIndex >= 0 &&
        normalizedIndex < count
      ) {
        lastIndex.current = normalizedIndex;
        runOnJS(playFeedback)();
        if (onItemChange) runOnJS(onItemChange)(items[normalizedIndex]);
      }
    };

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        runOnJS(handleIndexChange)(event.contentOffset.y);
      },
      onMomentumEnd: (event) => {
        if (!loop) return;
        const totalHeight = count * LOOP_ITERATIONS * effectiveItemHeight;
        if (event.contentOffset.y < totalHeight / 4 || event.contentOffset.y > totalHeight * 0.75) {
          const mid = count * (LOOP_ITERATIONS / 2);
          const offset =
            (mid + (Math.round(event.contentOffset.y / effectiveItemHeight) % count)) *
            effectiveItemHeight;
          flatListRef.current?.scrollToOffset({ offset, animated: false });
        }
      },
    });

    return (
      <View style={{ width, height: pickerHeight }}>
        <Animated.FlatList
          ref={flatListRef}
          data={data}
          renderItem={({ item, index }) => (
            <PickerItem
              item={item}
              index={index}
              scrollY={scrollY}
              itemHeight={effectiveItemHeight}
              width={width}
              fontSize={fontSize}
              textColor={textColor}
              font={font}
              fontWeight={fontWeight}
              onPress={() =>
                flatListRef.current?.scrollToOffset({
                  offset: index * effectiveItemHeight,
                  animated: true,
                })
              }
            />
          )}
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={effectiveItemHeight}
          snapToAlignment="center"
          decelerationRate={deceleration}
          disableIntervalMomentum={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: effectiveItemHeight * 2 }}
          getItemLayout={(_, index) => ({
            length: effectiveItemHeight,
            offset: effectiveItemHeight * index,
            index,
          })}
          windowSize={11}
        />
      </View>
    );
  }
);

const PickerItem = memo(
  ({
    item,
    index,
    scrollY,
    itemHeight,
    width,
    fontSize,
    textColor,
    font,
    fontWeight,
    onPress,
  }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const distance = Math.abs(scrollY.value - index * itemHeight);
      const opacity = interpolate(
        distance,
        [0, itemHeight * 0.9, itemHeight * 2],
        [1, 0.35, 0.1],
        Extrapolation.CLAMP
      );
      return { opacity };
    });

    return (
      <Pressable onPress={onPress}>
        <View style={{ height: itemHeight, width, justifyContent: 'center', alignItems: 'center' }}>
          <Animated.Text
            style={[
              { color: textColor, fontSize, fontWeight, fontFamily: font, letterSpacing: -0.5 },
              animatedStyle,
            ]}>
            {item}
          </Animated.Text>
        </View>
      </Pressable>
    );
  }
);
