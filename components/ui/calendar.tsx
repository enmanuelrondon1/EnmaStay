"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("group/calendar w-full p-2 [--cell-radius:999px]", className)}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "w-full",
        months: "relative flex w-full flex-col gap-4",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-9 rounded-full p-0 text-stone-400 hover:bg-stone-100 hover:text-ink"
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-9 rounded-full p-0 text-stone-400 hover:bg-stone-100 hover:text-ink"
        ),
        month_caption: "flex h-9 w-full items-center justify-center",
        caption_label: "font-serif text-base text-ink",
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7",
        weekday:
          "flex h-8 items-center justify-center text-[0.65rem] font-medium uppercase tracking-wide text-stone-400",
        week: "grid grid-cols-7",
        day: "p-0.5",
        range_start: "bg-brass/15 rounded-l-full",
        range_middle: "bg-brass/15",
        range_end: "bg-brass/15 rounded-r-full",
        today: "text-ink font-semibold",
        outside: "text-stone-300",
        disabled: "text-stone-300 opacity-60",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn("w-full", className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left")
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          if (orientation === "right")
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: ({ ...props }) => <CalendarDayButton locale={locale} {...props} />,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelectedSingle =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle

  return (
    <button
      ref={ref}
      data-day={day.date.toLocaleDateString(locale?.code)}
      className={cn(
        "mx-auto flex aspect-square w-full max-w-9 items-center justify-center rounded-full text-sm font-normal transition-colors hover:bg-stone-100",
        modifiers.today && "ring-1 ring-inset ring-ink/40",
        isSelectedSingle && "bg-ink text-canvas-soft hover:bg-ink",
        modifiers.range_start && "bg-ink text-canvas-soft hover:bg-ink",
        modifiers.range_end && "bg-ink text-canvas-soft hover:bg-ink",
        modifiers.range_middle && "bg-transparent text-ink hover:bg-transparent",
        modifiers.disabled && "pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }