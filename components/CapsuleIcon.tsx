import React from "react";
import Svg, { Path, Line } from "react-native-svg";

interface CapsuleIconProps {
  size?: number;
  color?: string;
}

export function CapsuleIcon({ size = 24, color = "#000" }: CapsuleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 9C4 6.79086 5.79086 5 8 5H16C18.2091 5 20 6.79086 20 9V15C20 17.2091 18.2091 19 16 19H8C5.79086 19 4 17.2091 4 15V9Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
