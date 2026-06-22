"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiaryStore } from "@/store/diary";
import { cn } from "@/utils";

const WEEKDAYS = ["L", "M", "Mi", "J", "V", "S", "D"];

function getMonthGrid(year: number, month: number) {
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startOffset = firstDay.getDay();
	const daysInMonth = lastDay.getDate();

	const days: (number | null)[] = [];
	for (let i = 0; i < (startOffset + 6) % 7; i++) {
		days.push(null);
	}
	for (let d = 1; d <= daysInMonth; d++) {
		days.push(d);
	}
	return days;
}

function getDateKeyFromParts(year: number, month: number, day: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function StreakCalendar() {
	const { noteContent, currentDate, setCurrentDate } = useDiaryStore();
	const [viewDate, setViewDate] = useState(() => new Date());

	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const today = new Date();

	const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

	const entries = useMemo(
		() => new Set(Object.keys(noteContent)),
		[noteContent],
	);

	const monthName = viewDate.toLocaleDateString("es-ES", {
		month: "long",
		year: "numeric",
	});

	const prevMonth = () =>
		setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
	const nextMonth = () =>
		setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

	const isToday = (d: number) =>
		d === today.getDate() &&
		month === today.getMonth() &&
		year === today.getFullYear();

	const isSelected = (d: number) =>
		d === currentDate.getDate() &&
		month === currentDate.getMonth() &&
		year === currentDate.getFullYear();

	const hasEntry = (day: number) =>
		entries.has(getDateKeyFromParts(year, month, day));

	return (
		<Card>
			<CardHeader className="px-4 py-3">
				<div className="flex items-center justify-between w-full">
					<Button
						variant="ghost"
						size="icon"
						onClick={prevMonth}
						className="h-7 w-7"
					>
						<ChevronLeft className="w-4 h-4" />
					</Button>
					<CardTitle className="text-sm font-medium capitalize">
						{monthName}
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={nextMonth}
						className="h-7 w-7"
					>
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="px-4 pb-4 pt-0">
				<div className="grid grid-cols-7 gap-1">
					{WEEKDAYS.map((wd) => (
						<div
							key={wd}
							className="text-center text-xs text-muted-foreground/50 h-6 flex items-center justify-center"
						>
							{wd}
						</div>
					))}
					{grid.map((day, i) =>
						day === null ? (
							<div key={`empty-${i}`} className="h-8" />
						) : (
							<button
								type="button"
								key={`day-${day}`}
								onClick={() => setCurrentDate(new Date(year, month, day))}
								className={cn(
									"relative h-8 w-full text-xs flex items-center justify-center rounded-full transition-colors",
									hasEntry(day)
										? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-medium"
										: "text-muted-foreground/60",
									isSelected(day) &&
										"ring-2 ring-primary ring-offset-1 ring-offset-background",
									isToday(day) &&
										!isSelected(day) &&
										"ring-2 ring-blue-400 ring-offset-1 ring-offset-background",
								)}
							>
								{day}
							</button>
						),
					)}
				</div>
			</CardContent>
		</Card>
	);
}
