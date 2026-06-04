"use client";

import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { chartMonths, chartSeries } from "../_data/overviewData";
import styles from "./dashboard.module.css";

const chartData = chartMonths.map((month, index) => ({
  month,
  solid: chartSeries.primary[index],
  dashed: chartSeries.secondary[index],
}));

const tickStyle = { fill: "#9ca3af", fontSize: 11, fontWeight: 500 };

export function OverviewChart() {
  return (
    <div className={styles.chartCard}>
      <h2 className={styles.chartTitle}>Total Event By Category</h2>
      <div className={styles.chartPlot}>
        <ResponsiveContainer width="100%" height={228}>
          <ComposedChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="solidAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#374151" stopOpacity={0.16} />
                <stop offset="70%" stopColor="#374151" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#374151" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={tickStyle}
              dy={10}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={tickStyle}
              domain={[0, 30]}
              ticks={[0, 10, 20, 30]}
              tickFormatter={(value) => (value === 0 ? "0" : `${value}K`)}
              width={36}
            />

            <Area
              type="monotone"
              dataKey="solid"
              stroke="none"
              fill="url(#solidAreaGradient)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="dashed"
              stroke="#b8c5d6"
              strokeWidth={2}
              strokeDasharray="7 7"
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="solid"
              stroke="#374151"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
