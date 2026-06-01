import { useCssElement } from "react-native-css";
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { Image as RNImage } from "expo-image";

const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage);

function CSSImage(props: React.ComponentProps<typeof AnimatedExpoImage>) {
  const flattened = (StyleSheet.flatten(props.style) || {}) as Record<string, any>;
  const { objectFit, objectPosition, ...style } = flattened;

  return (
    <AnimatedExpoImage
      contentFit={objectFit}
      contentPosition={objectPosition}
      {...props}
      source={
        typeof props.source === "string" ? { uri: props.source } : props.source
      }
      style={style}
    />
  );
}

export const Image = (
  props: React.ComponentProps<typeof CSSImage> & { className?: string }
) => {
  return useCssElement(CSSImage as any, props as any, { className: "style" }) as any;
};

Image.displayName = "CSS(Image)";
