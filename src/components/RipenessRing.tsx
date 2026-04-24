/**
 * RipenessRing — concentric SVG ring, filled to the current ripeness level.
 * Used on map pins and listing cards.
 */

import React from "react";
import Svg, { Circle, G } from "react-native-svg";
import { palette } from "../theme/tokens";
import { Ripeness, ripenessColor } from "../lib/ripeness";

export function RipenessRing({
  size = 28,
  ripeness,
  background = palette.cream,
  stroke = palette.bark,
}: {
  size?: number;
  ripeness: Ripeness | number;
  background?: string;
  stroke?: string;
}) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const segs = 5;
  const gap = 0.08; // radians
  const startAngle = -Math.PI / 2;
  const total = Math.PI * 2;
  const segAngle = total / segs;

  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r} fill={background} stroke={stroke} strokeWidth={1} />
      <G>
        {Array.from({ length: segs }).map((_, i) => {
          const a0 = startAngle + i * segAngle + gap;
          const a1 = startAngle + (i + 1) * segAngle - gap;
          const filled = i <= Math.round(ripeness);
          return (
            <Arc
              key={i}
              cx={cx}
              cy={cy}
              r={r - 2}
              a0={a0}
              a1={a1}
              color={filled ? ripenessColor(i) : palette.lineSoft}
            />
          );
        })}
      </G>
    </Svg>
  );
}

function Arc({ cx, cy, r, a0, a1, color }: any) {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const d = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  return (
    <G>
      <Arc2 d={d} color={color} />
    </G>
  );
}

function Arc2({ d, color }: { d: string; color: string }) {
  // Separate component so we can import Path lazily.
  const { Path } = require("react-native-svg");
  return <Path d={d} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />;
}
