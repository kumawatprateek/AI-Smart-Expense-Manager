import React from 'react';

interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
  totalLabel?: string;
  totalValue?: string;
  size?: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  totalLabel = 'Total',
  totalValue,
  size = 220,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
          <span className="text-xs">No data</span>
        </div>
      </div>
    );
  }

  let accumulatedPercent = 0;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {data.map((item, index) => {
          const percent = item.value / total;
          const strokeDashoffset = circumference - percent * circumference;
          const rotationAngle = accumulatedPercent * 360;
          accumulatedPercent += percent;

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(${rotationAngle} ${center} ${center})`}
              className="transition-all duration-500 hover:opacity-85 cursor-pointer"
            >
              <title>{`${item.label}: ${item.value} (${Math.round(percent * 100)}%)`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{totalLabel}</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{totalValue || total.toLocaleString()}</span>
      </div>
    </div>
  );
};

interface BarChartProps {
  data: { label: string; income: number; expense: number }[];
  height?: number;
  formatValue?: (val: number) => string;
}

export const ComparisonBarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  formatValue = (v) => v.toLocaleString(),
}) => {
  const maxVal = Math.max(
    1,
    ...data.flatMap((d) => [d.income, d.expense])
  );

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3 pt-6 pb-2" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const incomeHeight = (item.income / maxVal) * (height - 40);
          const expenseHeight = (item.expense / maxVal) * (height - 40);

          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <div className="flex items-end gap-1.5 w-full justify-center">
                {/* Income Bar */}
                <div
                  className="w-3 sm:w-4 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-300 relative"
                  style={{ height: `${Math.max(4, incomeHeight)}px` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                    Income: {formatValue(item.income)}
                  </div>
                </div>

                {/* Expense Bar */}
                <div
                  className="w-3 sm:w-4 bg-rose-500 hover:bg-rose-600 rounded-t transition-all duration-300 relative"
                  style={{ height: `${Math.max(4, expenseHeight)}px` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                    Expense: {formatValue(item.expense)}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 truncate max-w-[48px] text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
          <span className="text-slate-600 dark:text-slate-300">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
          <span className="text-slate-600 dark:text-slate-300">Expense</span>
        </div>
      </div>
    </div>
  );
};

interface SimpleTrendLineProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  formatValue?: (val: number) => string;
}

export const SimpleTrendLine: React.FC<SimpleTrendLineProps> = ({
  data,
  height = 140,
  color = '#3B82F6',
  formatValue = (v) => v.toLocaleString(),
}) => {
  if (data.length < 2) return null;

  const max = Math.max(...data.map((d) => d.value), 100);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  const width = 500;
  const padding = 20;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * graphWidth;
    const y = height - padding - ((d.value - min) / range) * graphHeight;
    return { x, y, value: d.value, label: d.label };
  });

  const pathString = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaString = `${pathString} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={areaString} fill={`url(#grad-${color.replace('#', '')})`} />

        {/* Line stroke */}
        <path d={pathString} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((pt, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke={color} strokeWidth="2.5" className="transition-transform group-hover:scale-150" />
            <text x={pt.x} y={height - 4} textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
