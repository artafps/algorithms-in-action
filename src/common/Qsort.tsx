import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Highlight = {
  pivot?: number;
  left?: number;
  right?: number;
};

export default function QuickSortVisualizer() {
  const [arr, setArr] = useState<number[]>([
    12, 4, 8, 20, 1, 15, 7, 3, 10, 2, 18, 9, 11, 6, 5,
  ]);
  const [speed, setSpeed] = useState<number>(200);
  const [size, setSize] = useState<number>(20);
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [stepMode, setStepMode] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<Highlight>({});
  const stepResolve = useRef<(() => void) | null>(null);

  useEffect(() => {
    // همگام‌سازی textarea وقتی سایز تغییر کنه (اختیاری)
    if (!arr || arr.length === 0) setArr(randomArray(size));
  }, []);

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

  // parse textarea input to numbers
  function parseTextToArray(text: string) {
    return text
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
  }

  // Partition + QuickSort (async for visualization)
  async function partition(a: number[], low: number, high: number) {
    const pivot = a[high];
    let i = low - 1;

    setHighlight({ pivot: high });
    await sleep(Math.max(20, speed / 3));
    await waitForStep();

    for (let j = low; j < high; j++) {
      setHighlight({ pivot: high, right: j });
      setComparisons((c) => c + 1);
      await sleep(speed);
      await waitForStep();

      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        setSwaps((s) => s + 1);
        setArr([...a]);
        setHighlight({ pivot: high, left: i, right: j });
        await sleep(Math.max(50, speed / 2));
        await waitForStep();
      }
    }

    // place pivot in correct spot
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    setSwaps((s) => s + 1);
    setArr([...a]);
    setHighlight({ pivot: i + 1 });
    await sleep(Math.max(50, speed / 2));
    await waitForStep();

    return i + 1;
  }

  async function quickSort(a: number[], low: number, high: number) {
    if (low < high) {
      const pi = await partition(a, low, high);
      await quickSort(a, low, pi - 1);
      await quickSort(a, pi + 1, high);
    }
  }

  // handlers for UI
  const handleRandom = () => {
    const n = Math.max(5, Math.min(20, size || 10));
    const r = randomArray(n);
    setArr(r);
  };

  const handleLoadFromText = (text: string) => {
    const parsed = parseTextToArray(text);
    if (parsed.length > 0) setArr(parsed);
  };

  const handleStart = async () => {
    if (isSorting) return;
    if (!arr || arr.length === 0)
      return alert("آرایه خالی است — ابتدا آرایه را وارد یا تولید کن.");
    setComparisons(0);
    setSwaps(0);
    setIsSorting(true);
    const copy = [...arr];
    await quickSort(copy, 0, copy.length - 1);
    setArr([...copy]);
    setIsSorting(false);
    setHighlight({});
    alert("مرتب‌سازی کامل شد!");
  };
  type BadgeVariant =
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "info";

  return (
    <Card className="max-w-4xl mx-auto my-6 p-4">
      <CardHeader>
        <CardTitle className="text-lg">
          مرتب‌سازی سریع — Quick Sort (نمایش گرافیکی)
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
          <div className="mt-6 flex items-end justify-center gap-1 rounded-md bg-muted p-4">
            {arr.map((val, idx) => {
              let variant: BadgeVariant = "outline";
              if (highlight.pivot === idx) variant = "info";
              else if (highlight.left === idx) variant = "destructive";
              else if (highlight.right === idx) variant = "success";

              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={variant}
                      className="flex-1 text-center py-6 text-lg font-bold"
                      onClick={handleStepAdvance}
                    >
                      {val}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={6}
                    className="rounded-md bg-slate-800 text-white px-2 py-1 text-sm"
                  >
                    <p>Index {idx}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        <div
          className="pt-20 mt-6 flex items-end h-72 gap-1 cursor-pointer rounded-md bg-slate-900 p-2"
          onClick={handleStepAdvance}
        >
          {arr.map((val, idx) => {
            const max = Math.max(...arr, 1);
            const h = (val / max) * 100 + 20;
            let color = "bg-blue-400";
            if (highlight.pivot === idx) color = "bg-red-400";
            else if (highlight.left === idx) color = "bg-orange-400";
            else if (highlight.right === idx) color = "bg-green-400";

            return (
              <div
                key={idx}
                className={`flex-1 flex justify-center items-end ${color} rounded-sm`}
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
