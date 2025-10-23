import React from "react";

interface ThreePartPieChartProps {
  impressions: number; // gray
  views: number;       // red
  quotes: number;      // black
}

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const angleRad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

const describeArc = (cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) => {
  const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    `Z`
  ].join(" ");
};

const ThreePartPieChart: React.FC<ThreePartPieChartProps> = ({ impressions, views, quotes }) => {
  const total = impressions + views + quotes; // avoid div by 0

  const redAngle = (views / total) * 360;
  const blackAngle = (quotes / total) * 360;

  const outerRadius = 80;
  const innerRadius = 65; // Inner radius for the ring effect
  const center = 91;
  if (total === 0) {
    // 🔹 fallback: render full gray circle when no data
    return (
      <svg width="183" height="182" viewBox="0 0 183 182">
        <path
          d={describeArc(center, center, outerRadius, innerRadius, 0, 360)}
          fill="#E9E9E9"
        />
      </svg>
    );
  }
  const redStart = 0;
  const redEnd = redStart + redAngle;
  const blackStart = redEnd;
  const blackEnd = blackStart + blackAngle;
  const grayStart = blackEnd;
  const grayEnd = 360;

  return (
    <svg width="183" height="182" viewBox="0 0 183 182">
      <path d={describeArc(center, center, outerRadius, innerRadius, grayStart, grayEnd)} fill="#E9E9E9" />
      <path d={describeArc(center, center, outerRadius, innerRadius, blackStart, blackEnd)} fill="#212121" />
      <path d={describeArc(center, center, outerRadius, innerRadius, redStart, redEnd)} fill="#D92C27" />
    </svg>
  );
};

export default ThreePartPieChart;