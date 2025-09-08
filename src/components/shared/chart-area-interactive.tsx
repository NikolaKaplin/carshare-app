import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", users: 222 },
  { date: "2024-04-02", users: 97 },
  { date: "2024-04-03", users: 167 },
  { date: "2024-04-04", users: 242 },
  { date: "2024-04-05", users: 373 },
  { date: "2024-04-06", users: 301 },
  { date: "2024-04-07", users: 245 },
  { date: "2024-04-08", users: 409 },
  { date: "2024-04-09", users: 59 },
  { date: "2024-04-10", users: 261 },
  { date: "2024-04-11", users: 327 },
  { date: "2024-04-12", users: 292 },
  { date: "2024-04-13", users: 342 },
  { date: "2024-04-14", users: 137 },
  { date: "2024-04-15", users: 120 },
  { date: "2024-04-16", users: 138 },
  { date: "2024-04-17", users: 446 },
  { date: "2024-04-18", users: 364 },
  { date: "2024-04-19", users: 243 },
  { date: "2024-04-20", users: 89 },
  { date: "2024-04-21", users: 137 },
  { date: "2024-04-22", users: 224 },
  { date: "2024-04-23", users: 138 },
  { date: "2024-04-24", users: 387 },
  { date: "2024-04-25", users: 215 },
  { date: "2024-04-26", users: 75 },
  { date: "2024-04-27", users: 383 },
  { date: "2024-04-28", users: 122 },
  { date: "2024-04-29", users: 315 },
  { date: "2024-04-30", users: 454 },
  { date: "2024-05-01", users: 165 },
  { date: "2024-05-02", users: 293 },
  { date: "2024-05-03", users: 247 },
  { date: "2024-05-04", users: 385 },
  { date: "2024-05-05", users: 481 },
  { date: "2024-05-06", users: 498 },
  { date: "2024-05-07", users: 388 },
  { date: "2024-05-08", users: 149 },
  { date: "2024-05-09", users: 227 },
  { date: "2024-05-10", users: 293 },
  { date: "2024-05-11", users: 335 },
  { date: "2024-05-12", users: 197 },
  { date: "2024-05-13", users: 197 },
  { date: "2024-05-14", users: 448 },
  { date: "2024-05-15", users: 473 },
  { date: "2024-05-16", users: 338 },
  { date: "2024-05-17", users: 499 },
  { date: "2024-05-18", users: 315 },
  { date: "2024-05-19", users: 235 },
  { date: "2024-05-20", users: 177 },
  { date: "2024-05-21", users: 82 },
  { date: "2024-05-22", users: 81 },
  { date: "2024-05-23", users: 252 },
  { date: "2024-05-24", users: 294 },
  { date: "2024-05-25", users: 201 },
  { date: "2024-05-26", users: 213 },
  { date: "2024-05-27", users: 420 },
  { date: "2024-05-28", users: 233 },
  { date: "2024-05-29", users: 78 },
  { date: "2024-05-30", users: 340 },
  { date: "2024-05-31", users: 178 },
  { date: "2024-06-01", users: 178 },
  { date: "2024-06-02", users: 470 },
  { date: "2024-06-03", users: 103 },
  { date: "2024-06-04", users: 439 },
  { date: "2024-06-05", users: 88 },
  { date: "2024-06-06", users: 294 },
  { date: "2024-06-07", users: 323 },
  { date: "2024-06-08", users: 385 },
  { date: "2024-06-09", users: 438 },
  { date: "2024-06-10", users: 155 },
  { date: "2024-06-11", users: 92 },
  { date: "2024-06-12", users: 492 },
  { date: "2024-06-13", users: 81 },
  { date: "2024-06-14", users: 426 },
  { date: "2024-06-15", users: 307 },
  { date: "2024-06-16", users: 371 },
  { date: "2024-06-17", users: 475 },
  { date: "2024-06-18", users: 107 },
  { date: "2024-06-19", users: 341 },
  { date: "2024-06-20", users: 408 },
  { date: "2024-06-21", users: 169 },
  { date: "2024-06-22", users: 317 },
  { date: "2024-06-23", users: 480 },
  { date: "2024-06-24", users: 132 },
  { date: "2024-06-25", users: 141 },
  { date: "2024-06-26", users: 434 },
  { date: "2024-06-27", users: 448 },
  { date: "2024-06-28", users: 149 },
  { date: "2024-06-29", users: 103 },
  { date: "2024-06-30", users: 446 },
];

const chartConfig = {
  users: {
    label: "Пользователи",
    color: "hsl(221.2 83.2% 53.3%)", // Синий цвет из темы
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Статистика использования</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Всего за последние 3 месяца
          </span>
          <span className="@[540px]/card:hidden">Последние 3 месяца</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Последние 3 месяца</ToggleGroupItem>
            <ToggleGroupItem value="30d">Последние 30 дней</ToggleGroupItem>
            <ToggleGroupItem value="7d">Последние 7 дней</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
          style={
            {
              "--color-users": "hsl(221.2 83.2% 53.3%)",
              "--color-users-secondary": "hsl(210 40% 96%)",
            } as React.CSSProperties
          }
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-users-secondary)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ru-RU", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ru-RU", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="users"
              type="natural"
              fill="url(#fillUsers)"
              stroke="var(--color-users)"
              strokeWidth={2}
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
