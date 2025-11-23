import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface CapsuleIconProps {
  size?: number;
  color?: string;
}

export function CapsuleIcon({ size = 24, color = "#000" }: CapsuleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12C3 7.58172 6.58172 4 11 4H13C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20H11C6.58172 20 3 16.4183 3 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect
        x="12"
        y="4"
        width="1"
        height="16"
        fill={color}
      />
      <Path
        d="M7 8C7 7.44772 7.44772 7 8 7H9C9.55228 7 10 7.44772 10 8V10C10 10.5523 9.55228 11 9 11H8C7.44772 11 7 10.5523 7 10V8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
