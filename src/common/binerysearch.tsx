import  { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type Highlight = {
  left?: number;
  right?: number;
  mid?: number;
  found?: boolean;
};

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "info";

export default function BinarySearchVisualizer() {
  const [arr, setArr] = useState<number[]>([1, 3, 4, 7, 8, 10, 12, 15, 20]);
  const [speed, setSpeed] = useState<number>(400);
  const [target, setTarget] = useState<number>(7);
  const [stepMode, setStepMode] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<Highlight>({});
  const [result, setResult] = useState<number | null>(null);
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
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b); // حتماً مرتب
  }

  const handleLoadFromText = (text: string) => {
    const parsed = parseTextToArray(text);
    if (parsed.length > 0) {
      setArr(parsed);
      setResult(null);
    }
  };

  const handleRandom = () => {
    const r = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 1
    ).sort((a, b) => a - b);
    setArr(r);
    setResult(null);
  };

  const handleStart = async () => {
    if (isSearching) return;
    if (!arr || arr.length === 0) return alert("آرایه خالی است.");

    setIsSearching(true);
    setResult(null);

    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setHighlight({ left, right, mid });
      await sleep(speed);
      await waitForStep();

      if (arr[mid] === target) {
        setHighlight({ left, right, mid, found: true });
        setResult(mid);
        break;
      } else if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (result === null) {
      setResult(-1);
    }

    setIsSearching(false);
  };

  return (
    <Card className="max-w-4xl mx-auto my-6 p-4">
      <CardHeader>
        <CardTitle className="text-lg">
          جستجوی دودویی — Binary Search (نمایش گرافیکی)
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
            تولید آرایه تصادفی (مرتب)
          </Button>
          <Button
            variant="destructive"
            className="m-2"
            onClick={handleStart}
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
            {stepMode
              ? "غیرفعال کردن حالت مرحله‌ای"
              : "نمایش مرحله‌ای (گام‌به‌گام)"}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm">سرعت</span>
            <div className="w-36">
              <Slider
                defaultValue={[speed]}
                min={100}
                max={2000}
                onValueChange={(v) => setSpeed(v[0])}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">هدف</span>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-24 border rounded px-2 py-1 text-sm"
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
            <div>
              نتیجه:{" "}
              {result === null
                ? "—"
                : result === -1
                ? "پیدا نشد"
                : `ایندکس ${result}`}
            </div>
            <Button
              variant="destructive"
              className="m-2"
              onClick={() => {
                setResult(null);
                setHighlight({});
              }}
              disabled={isSearching}
            >
              ریست
            </Button>
          </div>
        </div>

        <TooltipProvider>
          <div className="mt-6 flex items-end justify-center gap-1 rounded-md bg-muted p-4">
            {arr.map((val, idx) => {
              let variant: BadgeVariant = "outline";
              if (highlight.mid === idx)
                variant = highlight.found ? "success" : "info";
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

        {/* visualization area */}
        <div
          className="mt-6 flex items-end h-72 gap-1 rounded-md bg-slate-900 p-2"
          role="group"
        >
          {arr.map((val, idx) => {
            const max = Math.max(...arr, 1);
            const h = (val / max) * 100;
            let extra = "bg-blue-400";
            if (highlight.left === idx) extra = "bg-orange-400";
            if (highlight.right === idx) extra = "bg-purple-400";
            if (highlight.mid === idx)
              extra = highlight.found ? "bg-green-500" : "bg-red-400";
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
