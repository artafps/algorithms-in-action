"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type Highlight = {
  current?: number;
  found?: number;
};

type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "info";

export default function LinearSearchVisualizer() {
  const [arr, setArr] = useState<number[]>([12, 4, 8, 20, 1, 15, 7, 3, 10]);
  const [speed, setSpeed] = useState<number>(300);
  const [comparisons, setComparisons] = useState<number>(0);
  const [stepMode, setStepMode] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<Highlight>({});
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [target, setTarget] = useState<number | null>(null);
  const stepResolve = useRef<(() => void) | null>(null);

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
    const r = Array.from(
      { length: 15 },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArr(r);
    setComparisons(0);
    setHighlight({});
  };

  const handleLoadFromText = (text: string) => {
    const parsed = parseTextToArray(text);
    if (parsed.length > 0) setArr(parsed);
  };

  const handleSearch = async () => {
    if (isSearching || target === null) return;
    if (arr.length === 0) return alert("آرایه خالی است.");

    setComparisons(0);
    setHighlight({});
    setIsSearching(true);

    for (let i = 0; i < arr.length; i++) {
      setHighlight({ current: i });
      setComparisons((c) => c + 1);
      await sleep(speed);
      await waitForStep();

      if (arr[i] === target) {
        setHighlight({ found: i });
        setIsSearching(false);
        alert(`عنصر ${target} در ایندکس ${i} پیدا شد ✅`);
        return;
      }
    }

    setIsSearching(false);
    alert(`عنصر ${target} پیدا نشد ❌`);
  };

  return (
    <Card className="max-w-4xl mx-auto my-6 p-4">
      <CardHeader>
        <CardTitle className="text-lg">
          جستجوی خطی — Linear Search (نمایش گرافیکی)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="destructive"
            className="m-2"
            onClick={handleRandom}
            disabled={isSearching}
          >
            تولید آرایه تصادفی
          </Button>
          <Button
            variant="destructive"
            className="m-2"
            onClick={handleSearch}
            disabled={isSearching}
          >
            شروع جستجو
          </Button>
          <Button
            variant="destructive"
            className="m-2"
            onClick={() => setStepMode(!stepMode)}
            disabled={isSearching}
          >
            {stepMode ? "غیرفعال کردن حالت مرحله‌ای" : "نمایش مرحله‌ای"}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm">سرعت</span>
            <div className="w-36">
              <Slider
                defaultValue={[speed]}
                min={50}
                max={1000}
                onValueChange={(v) => setSpeed(v[0])}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">عنصر هدف</span>
            <Input
              type="number"
              value={target ?? ""}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-24"
            />
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
            <Button
              variant="destructive"
              className="m-2"
              onClick={() => {
                setComparisons(0);
                setHighlight({});
              }}
              disabled={isSearching}
            >
              ریست
            </Button>
          </div>
        </div>

        {/* badges row (keeps the visual bars below) */}
        <TooltipProvider>
          <div className="mt-6 flex items-end justify-center gap-1 rounded-md bg-muted p-4">
            {arr.map((val, idx) => {
              let variant: BadgeVariant = "outline";
              if (highlight.found === idx) variant = "success";
              else if (highlight.current === idx) variant = "info";

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
            if (highlight.current === idx) extra = "bg-yellow-400";
            if (highlight.found === idx) extra = "bg-green-500";
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
