"use client";

import { useMemo, useState } from "react";

type DailyItem = {
  bid: string;
  timestamp: string;
};

type Props = {
  data: DailyItem[];
  color: string;
  label: string;
};

function formatDate(timestamp: string) {
  const date = new Date(Number(timestamp) * 1000);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function formatFullDate(timestamp: string) {
  const date = new Date(Number(timestamp) * 1000);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatValue(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CurrencyChart({ data, color, label }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return [...data]
      .filter((item) => Number.isFinite(Number(item.bid)))
      .reverse();
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-default bg-surface text-sm text-muted">
        Histórico indisponível.
      </div>
    );
  }

  const values = chartData.map((item) => Number(item.bid));

  const width = 760;
  const height = 300;

  const padding = {
    top: 30,
    right: 28,
    bottom: 48,
    left: 64,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const rawRange = maxValue - minValue;

  const range = rawRange === 0 ? Math.max(maxValue * 0.02, 0.01) : rawRange;

  const chartMin = minValue - range * 0.12;
  const chartMax = maxValue + range * 0.12;
  const chartRange = chartMax - chartMin;

  function scaleX(index: number) {
    if (chartData.length === 1) {
      return padding.left + chartWidth / 2;
    }

    return padding.left + (index / (chartData.length - 1)) * chartWidth;
  }

  function scaleY(value: number) {
    return padding.top + ((chartMax - value) / chartRange) * chartHeight;
  }

  const points = values.map((value, index) => ({
    x: scaleX(index),
    y: scaleY(value),
    value,
  }));

  const linePath = points
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    })
    .join(" ");

  const areaPath = [
    `M ${points[0].x} ${height - padding.bottom}`,
    ...points.map((point) => `L ${point.x} ${point.y}`),
    `L ${points[points.length - 1].x} ${height - padding.bottom}`,
    "Z",
  ].join(" ");

  const yTickCount = 4;

  const yTicks = Array.from({ length: yTickCount }, (_, index) => {
    const ratio = index / (yTickCount - 1);
    const value = chartMax - ratio * chartRange;

    return {
      value,
      y: scaleY(value),
    };
  });

  const xTickCount = Math.min(5, chartData.length);

  const xTicks = Array.from({ length: xTickCount }, (_, index) => {
    const chartIndex =
      xTickCount === 1
        ? 0
        : Math.round((chartData.length - 1) * (index / (xTickCount - 1)));

    return {
      index: chartIndex,
      x: scaleX(chartIndex),
    };
  });

  const selectedPoint =
    hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const selectedData =
    hoverIndex !== null
      ? chartData[hoverIndex]
      : chartData[chartData.length - 1];

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-xl bg-surface">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto min-h-56 w-full"
          role="img"
          aria-label={`Histórico da cotação ${label} nos últimos 30 dias`}
        >
          <defs>
            <linearGradient
              id={`currency-area-${label}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.18" />

              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, index) => (
            <g key={`y-${index}`}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={tick.y}
                y2={tick.y}
                stroke="currentColor"
                strokeOpacity="0.08"
              />

              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="currentColor"
                opacity="0.55"
              >
                {tick.value.toFixed(2)}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#currency-area-${label})`} />

          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {hoverIndex !== null && (
            <>
              <line
                x1={selectedPoint.x}
                x2={selectedPoint.x}
                y1={padding.top}
                y2={height - padding.bottom}
                stroke={color}
                strokeOpacity="0.3"
                strokeDasharray="4 4"
              />

              <circle
                cx={selectedPoint.x}
                cy={selectedPoint.y}
                r="7"
                fill="var(--color-surface)"
                stroke={color}
                strokeWidth="3"
              />
            </>
          )}

          {xTicks.map((tick, index) => (
            <text
              key={`x-${index}`}
              x={tick.x}
              y={height - 16}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              opacity="0.55"
            >
              {formatDate(chartData[tick.index].timestamp)}
            </text>
          ))}

          {points.map((point, index) => (
            <circle
              key={`hit-${index}`}
              cx={point.x}
              cy={point.y}
              r="14"
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}
        </svg>

        {hoverIndex !== null && (
          <div
            className="pointer-events-none absolute left-1/2 top-4 min-w-36 -translate-x-1/2 rounded-xl border border-default bg-surface/95 px-3 py-2 shadow-lg backdrop-blur-md"
            role="status"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              {formatFullDate(selectedData.timestamp)}
            </p>

            <p className="mt-1 text-sm font-extrabold" style={{ color }}>
              {formatValue(selectedPoint.value)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
