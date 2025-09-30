import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Highlight = {
  left?: [number, number]
  right?: [number, number]
  merge?: [number, number]
}

export default function MergeSortVisualizer() {
  const [arr, setArr] = useState<number[]>([12,4,8,20,1,15,7,3,10,2,18,9,11,6,5])
  const [speed, setSpeed] = useState<number>(200)
  const [comparisons, setComparisons] = useState(0)
  const [writes, setWrites] = useState(0)
  const [stepMode, setStepMode] = useState(false)
  const [highlight, setHighlight] = useState<Highlight>({})
  const [isSorting, setIsSorting] = useState(false)
  const stepResolve = useRef<(() => void) | null>(null)

  function randomArray(n: number) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1)
  }

  async function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
  }

  async function waitForStep() {
    if (!stepMode) return
    return new Promise<void>((resolve) => {
      stepResolve.current = resolve
    })
  }

  function handleStepAdvance() {
    if (stepResolve.current) {
      stepResolve.current()
      stepResolve.current = null
    }
  }

  async function mergeSortVisual(a: number[]) {
    setIsSorting(true)
    const aux = [...a]

    async function merge(left: number, mid: number, right: number) {
      let i = left,
        j = mid + 1,
        k = left

      setHighlight({ left: [left, mid], right: [mid + 1, right] })
      await sleep(Math.max(20, speed / 2))
      await waitForStep()

      while (i <= mid && j <= right) {
        setComparisons((c) => c + 1)
        if (a[i] <= a[j]) {
          aux[k++] = a[i++]
        } else {
          aux[k++] = a[j++]
        }
        setWrites((w) => w + 1)
        setArr([...aux])
        setHighlight({ merge: [left, right] })
        await sleep(speed)
        await waitForStep()
      }
      while (i <= mid) {
        aux[k++] = a[i++]
        setWrites((w) => w + 1)
        setArr([...aux])
        setHighlight({ merge: [left, right] })
        await sleep(speed)
        await waitForStep()
      }
      while (j <= right) {
        aux[k++] = a[j++]
        setWrites((w) => w + 1)
        setArr([...aux])
        setHighlight({ merge: [left, right] })
        await sleep(speed)
        await waitForStep()
      }

      for (let idx = left; idx <= right; idx++) {
        a[idx] = aux[idx]
        setArr([...a])
        await sleep(Math.max(10, speed / 3))
      }
    }

    async function sort(l: number, r: number) {
      if (l >= r) return
      const m = Math.floor((l + r) / 2)
      await sort(l, m)
      await sort(m + 1, r)
      await merge(l, m, r)
    }

    await sort(0, a.length - 1)
    setIsSorting(false)
    setHighlight({})
  }

  return (
    <Card className="max-w-4xl mx-auto my-6 p-4">
      <CardHeader>
        <CardTitle className="text-lg">مرتب‌سازی ادغامی — Merge Sort (React + TS)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* کنترل‌ها */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button onClick={() => setArr(randomArray(20))}>تولید آرایه تصادفی</Button>
          <Button onClick={() => !isSorting && mergeSortVisual([...arr])}>شروع مرتب‌سازی</Button>
          <Button variant="outline" onClick={() => setStepMode(!stepMode)}>
            {stepMode ? "غیرفعال کردن حالت مرحله‌ای" : "نمایش مرحله‌ای"}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm">سرعت</span>
            <Slider
              defaultValue={[200]}
              min={10}
              max={1000}
              onValueChange={(v) => setSpeed(v[0])}
              className="w-32"
            />
          </div>
        </div>

        {/* Textarea + Stats */}
        <div className="flex gap-4 flex-wrap">
          <Textarea
            className="flex-1"
            value={arr.join(",")}
            onChange={(e) =>
              setArr(
                e.target.value
                  .split(",")
                  .map((s) => parseFloat(s.trim()))
                  .filter((n) => !isNaN(n))
              )
            }
          />
          <div className="flex flex-col gap-2 text-sm">
            <div>مقایسه‌ها: {comparisons}</div>
            <div>جابجایی‌ها: {writes}</div>
            <Button variant="outline" onClick={() => setArr([...arr])}>
              ریست
            </Button>
          </div>
        </div>

        {/* نمایش گرافیکی */}
        <div
          className="mt-6 flex items-end h-72 gap-1 cursor-pointer rounded-md bg-slate-900 p-2"
          onClick={handleStepAdvance}
        >
          {arr.map((val, idx) => {
            const max = Math.max(...arr, 1)
            const h = (val / max) * 100
            let color = "bg-blue-400"
            if (highlight.left && idx >= highlight.left[0] && idx <= highlight.left[1])
              color = "bg-red-400"
            if (highlight.right && idx >= highlight.right[0] && idx <= highlight.right[1])
              color = "bg-orange-400"
            if (highlight.merge && idx >= highlight.merge[0] && idx <= highlight.merge[1])
              color = "bg-green-400"

            return (
              <div
                key={idx}
                className={`flex-1 flex justify-center items-end ${color} rounded-sm`}
                style={{ height: `${h}%` }}
              >
                <span className="text-xs text-slate-900 font-bold pb-1">{val}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
