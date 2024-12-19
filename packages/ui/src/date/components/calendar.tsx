"use client"
import { classnames } from "@wolfden-ui/system"
import { useMemo, useState } from "react"

interface Weekday {
	value: Date
	disabled: boolean
	isToday: boolean
	isSelected: boolean
	isOutside: boolean
}

export type CalendarColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info"

export interface CalendarProps {
	color?: CalendarColor

	value?: Date | string | number

	onChange?: (date: Date) => void

	locale?: string

	weekday?: Intl.DateTimeFormatOptions["weekday"]

	month?: Intl.DateTimeFormatOptions["month"]

	year?: Intl.DateTimeFormatOptions["year"]
}

export function Calendar({ color = "default", value, locale = "es-AR", weekday = "narrow", month = "long", year = "numeric" }: CalendarProps) {
	const [calendar, setCalendar] = useState(!value ? new Date() : value instanceof Date ? value : new Date(value))
	const [selectedDate, setSelectedDate] = useState<Date | null>(!value ? null : value instanceof Date ? value : new Date(value))

	const weekNames = useMemo(() => {
		const weekNames: string[] = []
		for (let i = 0; i < 7; i++) {
			weekNames.push(new Date(2021, 5, i).toLocaleDateString(locale, { weekday }))
		}

		return weekNames
	}, [locale])

	const weeks = useMemo(() => {
		selectedDate?.setHours(0, 0, 0, 0)

		const year = calendar.getFullYear()
		const month = calendar.getMonth()

		const weeks: Weekday[][] = []
		const weekdays: Weekday[] = []
		const firstDayOfMonth = new Date(year, month, 1)
		const lastDayOfMonth = new Date(year, month + 1, 0)

		const today = new Date()
		today.setHours(0, 0, 0, 0)

		let startDayOfWeek = firstDayOfMonth.getDay()
		if (startDayOfWeek === 0) startDayOfWeek = 7 // Lunes como primer día de la semana

		// Obtener los días del mes anterior que faltan al principio
		for (let i = startDayOfWeek - 1; i > 0; i--) {
			const date = new Date(year, month, 1 - i)
			date.setHours(0, 0, 0, 0)
			weekdays.push({
				value: date,
				isSelected: date.getTime() === selectedDate?.getTime(),
				isToday: date.getTime() === today.getTime(),
				disabled: false,
				isOutside: true,
			})
		}

		// Obtener los días del mes actual
		for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
			const date = new Date(year, month, day)
			date.setHours(0, 0, 0, 0)
			weekdays.push({
				value: date,
				isSelected: date.getTime() === selectedDate?.getTime(),
				isToday: date.getTime() === today.getTime(),
				disabled: false,
				isOutside: false,
			})
		}

		// Completar con los días del siguiente mes
		const remainingDays = 7 - (weekdays.length % 7)
		if (remainingDays < 7) {
			for (let i = 1; i <= remainingDays; i++) {
				const date = new Date(year, month + 1, i)
				date.setHours(0, 0, 0, 0)
				weekdays.push({
					value: date,
					isSelected: date.getTime() === selectedDate?.getTime(),
					isToday: date.getTime() === today.getTime(),
					disabled: false,
					isOutside: true,
				})
			}
		}

		// Organizar los días en semanas
		while (weekdays.length > 0) {
			weeks.push(weekdays.splice(0, 7))
		}

		return weeks
	}, [calendar, selectedDate])

	return (
		<div className="bg-content-100 dark:bg-content-900 text-content-fg-100 dark:text-content-fg-900 w-min mx-auto mt-20 p-4 rounded-xl">
			<div className="flex justify-between items-center gap-2 my-2">
				<button
					className="w-8 h-8 flex-shrink-0 inline-flex justify-center items-center rounded-full hover:bg-content-200/70 dark:hover:bg-content-800/70"
					onClick={() => setCalendar(new Date(calendar.getFullYear(), calendar.getMonth() - 1))}
				>
					{/* <ChevronLeftIcon className="w-4 h-4 text-content-fg-200 dark:text-content-fg-800" /> */}
				</button>

				<button className="flex w-full justify-center items-center px-4 py-1 rounded-full text-base bg-content-200/70 dark:bg-content-800/70 hover:bg-content-200/100 dark:hover:bg-content-800/100 whitespace-nowrap">
					{calendar.toLocaleString(locale, { month, year })}
				</button>

				<button
					className="w-8 h-8 flex-shrink-0 inline-flex justify-center items-center rounded-full hover:bg-content-200/70 dark:hover:bg-content-800/70"
					onClick={() => setCalendar(new Date(calendar.getFullYear(), calendar.getMonth() + 1))}
				>
					{/* <ChevronRightIcon className="w-4 h-4 text-content-fg-200 dark:text-content-fg-800" /> */}
				</button>
			</div>
			<div className="flex justify-center">
				<table>
					<thead>
						<tr>
							{weekNames.map((weekName, i) => (
								<th
									key={`${weekName}-${i}`}
									className={classnames("bg-content-200/70 dark:bg-content-800/70 select-none px-2 py-1", {
										"rounded-l-full": i === 0,
										"rounded-r-full": i === weekNames.length - 1,
									})}
								>
									{weekName}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{weeks.map((daysOfWeek, i) => (
							<tr key={`${i}-week`} className="text-center">
								{daysOfWeek.map((date, i) => (
									<td key={`${i}-day`} className="px-0.5 py-1">
										<button
											className={classnames(
												"inline-flex justify-center items-center w-8 h-8 text-sm rounded-full select-none",
												color === "default" && [
													"bg-transparent ring-2 ring-inset ring-transparent hover:bg-content-200/70 dark:hover:bg-content-800/70",
													{
														"text-content-fg-100/50 dark:text-content-fg-900/50": date.disabled || date.isOutside,
														"bg-content text-content-foreground hover:bg-content dark:hover:bg-content ring-content-fg-100/50 dark:ring-content-fg-900/50": date.isToday,
														"bg-content text-content-foreground hover:bg-content dark:hover:bg-content": date.isSelected,
													},
												]
											)}
											disabled={date.disabled}
											onClick={() => {
												setSelectedDate(date.value)
												if (date.isOutside) setCalendar(new Date(date.value.getFullYear(), date.value.getMonth()))
											}}
										>
											{date.value.getDate()}
										</button>
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
