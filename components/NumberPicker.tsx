"use client";

import { MAIN_COUNT, NUMBER_MAX } from "@/lib/types";

type Props = {
  value: number[];
  onChange: (nums: number[]) => void;
  max?: number;
  count?: number;
  label?: string;
};

export default function NumberPicker({
  value,
  onChange,
  max = NUMBER_MAX,
  count = MAIN_COUNT,
  label = "Números",
}: Props) {
  const toggle = (n: number) => {
    if (value.includes(n)) {
      onChange(value.filter((x) => x !== n));
    } else {
      if (value.length >= count) return;
      onChange([...value, n].sort((a, b) => a - b));
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-zinc-500">
          {value.length}/{count}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:grid-cols-10">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const selected = value.includes(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => toggle(n)}
              className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                selected
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}