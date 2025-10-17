import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Badge } from "@/components/ui/badge";
type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "info";

type Highlight = {
  current?: number;
  next?: number;
};

export default function BubbleSortVisualizer() {
  const [arr, setArr] = useState<number[]>([12, 4, 8, 20, 1, 15, 7, 3, 10]);
  const [speed, setSpeed] = useState<number>(200);
  const [size, setSize] = useState<number>(20);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [stepMode, setStepMode] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<Highlight>({});

  const stepResolve = useRef<(() => void) | null>(null);

  function randomArray(n: number) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
  }

  function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function waitForStep() {
    if (!stepMode) return Promise.resolve();
    return new Promise<void>((resolve) => {
      stepResolve.current = resolve;
    });
  }

  function handleStepAdvance() {
    if (stepResolve.current) {
      stepResolve.current();
      stepResolve.current = null;
    }
  }

  function parseTextToArray(text: string) {
    return text
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
  }

  const handleRandom = () => {
    const n = Math.max(5, Math.min(20, size || 10));
    const r = randomArray(n);
    setArr(r);
    setComparisons(0);
    setSwaps(0);
  };

  const handleLoadFromText = (text: string) => {
    const parsed = parseTextToArray(text);
    if (parsed.length > 0) setArr(parsed);
  };

  const handleStart = async () => {
    if (isSorting) return;
    if (!arr || arr.length === 0) return alert("آرایه خالی است.");

    setComparisons(0);
    setSwaps(0);
    setIsSorting(true);

    const a = [...arr];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setHighlight({ current: j, next: j + 1 });
        setComparisons((c) => c + 1);
        await sleep(speed);
        await waitForStep();

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          setSwaps((s) => s + 1);
          setArr([...a]);
          await sleep(speed);
          await waitForStep();
        }
      }
    }

    setArr([...a]);
    setHighlight({});
    setIsSorting(false);
    alert("مرتب‌سازی کامل شد!");
  };

  return (
    <Card className="max-w-4xl mx-auto my-6 p-4">
      <CardHeader>
        <CardTitle className="text-lg">
          مرتب‌سازی حبابی — Bubble Sort (نمایش گرافیکی)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="destructive"
            className="m-2"
            onClick={handleRandom}
            disabled={isSorting}
          >
            تولید آرایه تصادفی
          </Button>
          <Button
            variant="destructive"
            className="m-2"
            onClick={handleStart}
            disabled={isSorting}
          >
            شروع مرتب‌سازی
          </Button>
          <Button
            variant="destructive"
            className="m-2"
            onClick={() => setStepMode(!stepMode)}
            disabled={isSorting}
          >
            {stepMode
              ? "غیرفعال کردن حالت مرحله‌ای"
              : "نمایش مرحله‌ای (گام‌به‌گام)"}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm">سرعت</span>
            <div className="w-36">
              <Slider
                defaultValue={[speed]}
                min={10}
                max={1000}
                onValueChange={(v) => setSpeed(v[0])}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">اندازه</span>
            <input
              type="range"
              min={5}
              max={20}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-36"
            />
            <span className="text-sm">{size}</span>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Textarea
            className="flex-1"
            value={arr.join(",")}
            onChange={(e) => handleLoadFromText(e.target.value)}
          />
          <div className="flex flex-col gap-2 text-sm">
            <div>مقایسه‌ها: {comparisons}</div>
            <div>جابجایی‌ها: {swaps}</div>
            <Button
              variant="destructive"
              className="m-2"
              onClick={() => {
                setArr([...arr]);
                setComparisons(0);
                setSwaps(0);
              }}
              disabled={isSorting}
            >
              ریست
            </Button>
          </div>
        </div>
        <TooltipProvider>
          <div
            className="mt-6 flex items-end justify-center gap-1 rounded-md bg-muted p-4 cursor-pointer"
            onClick={handleStepAdvance}
          >
            {arr.map((val, idx) => {
              // map highlight ranges to badge variants
              let variant: BadgeVariant = "outline";
              if (highlight.current === idx) {
                variant = "destructive";
              } else if (highlight.next === idx) {
                variant = "success";
              }

              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={variant}
                      className="flex-1 text-center py-6 text-lg font-bold"
                    >
                      {val}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Index {idx}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        {/* visualization area */}
        <div
          className="mt-6 flex items-end h-72 gap-1 cursor-pointer rounded-md bg-slate-900 p-2"
          onClick={handleStepAdvance}
          role="button"
        >
          {arr.map((val, idx) => {
            const max = Math.max(...arr, 1);
            const h = (val / max) * 100;
            let extra = "bg-blue-400";
            if (highlight.current === idx) extra = "bg-red-400";
            if (highlight.next === idx) extra = "bg-green-400";
            return (
              <div
                key={idx}
                className={`flex-1 flex justify-center items-end ${extra} rounded-sm`}
                style={{ height: `${h}%` }}
              >
                <span className="text-xs text-slate-900 font-bold pb-1">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
