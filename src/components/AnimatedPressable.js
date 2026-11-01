import React, { useRef } from 'react';
import { Pressable, Animated, Platform } from 'react-native';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export default function AnimatedPressable({
  children,
  style,
  scaleTo = 0.96,
  onPress,
  disabled = false,
  ...rest
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: scaleTo,
      speed: 24,
      bounciness: 4,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 24,
      bounciness: 4,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
