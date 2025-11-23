import React from "react";
import Svg, { Rect, Line, G } from "react-native-svg";

interface CapsuleIconProps {
  size?: number;
  color?: string;
}

export function CapsuleIcon({ size = 24, color = "#000" }: CapsuleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(-45 12 12)">
        <Rect
          x="6"
          y="9"
          width="12"
          height="6"
          rx="3"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Line
          x1="12"
          y1="9"
          x2="12"
          y2="15"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
