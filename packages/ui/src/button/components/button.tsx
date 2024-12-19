"use client"
import { classnames, PolymorphicProps } from "@wolfden-ui/system"
import { ElementType, useRef, useState } from "react"

export type ButtonProps<E extends ElementType = "button"> = PolymorphicProps<E> & {
	variant?: "outline" | "solid" | "ghost" | "link" | "text"

	color?: "primary" | "secondary" | "danger" | "warning" | "success" | "info"

	size?: "sm" | "md" | "lg"

	ripple?: boolean

	fullWidth?: boolean

	iconOnly?: boolean

	rounded?: boolean

	isLoading?: boolean

	disabled?: boolean
}

export function Button<E extends ElementType = "button">(props: ButtonProps<E>) {
	const { as: Btn = "button", variant = "solid", color = "primary", size = "md", ripple = true, disabled, isLoading, iconOnly, rounded, fullWidth, children, className, onClick, ...restProps } = props
	const [rippleMap, setRipple] = useState<Array<{ x: number; y: number; size: number }>>([])
	const debounceRipple = useRef<NodeJS.Timeout>()

	function handleOnClick(ev: React.MouseEvent<HTMLButtonElement>) {
		if (onClick) onClick(ev)
		if (!ripple || disabled || isLoading || variant === "link") return

		const btn = ev.currentTarget

		const rect = btn.getBoundingClientRect()
		const size = Math.max(rect.width, rect.height) * 2

		const x = ev.clientX - rect.left - size / 2
		const y = ev.clientY - rect.top - size / 2

		setRipple((allRipples) => [...allRipples, { x, y, size }])
		if (debounceRipple.current) clearTimeout(debounceRipple.current)
		debounceRipple.current = setTimeout(() => {
			setRipple([])
			debounceRipple.current = undefined
		}, 1000)
	}

	return (
		<Btn
			className={classnames(
				"relative flex-shrink-0 justify-center items-center font-semibold transition-colors duration-300 ease-in-out",
				{
					"flex w-full": fullWidth,
					"inline-flex": !fullWidth,
					"rounded-full": rounded,
					"rounded-2xl": !rounded,
					"px-3 py-1.5 text-sm gap-2": size === "sm" && !iconOnly,
					"px-4 py-2 text-base gap-3": size === "md" && !iconOnly,
					"px-6 py-3 text-lg gap-4": size === "lg" && !iconOnly,
					"w-8 h-8": size === "sm" && iconOnly,
					"w-10 h-10": size === "md" && iconOnly,
					"w-12 h-12": size === "lg" && iconOnly,
					"opacity-75 pointer-events-none": disabled || isLoading,
				},
				variant === "solid" && [
					"backdrop-blur-md shadow-lg",
					{
						"text-primary-fg bg-primary hover:bg-primary/90 focus:bg-primary/80": color === "primary",
						"text-secondary-fg bg-secondary hover:bg-secondary/90 focus:bg-secondary/80": color === "secondary",
						"text-danger-fg bg-danger hover:bg-danger/90 focus:bg-danger/80": color === "danger",
						"text-warning-fg bg-warning hover:bg-warning/90 focus:bg-warning/80": color === "warning",
						"text-success-fg bg-success hover:bg-success/90 focus:bg-success/80": color === "success",
						"text-info-fg bg-info hover:bg-info/90 focus:bg-info/80": color === "info",
					},
				],
				variant === "outline" && [
					"border-2 shadow-lg",
					{
						"text-primary border-primary hover:bg-primary/10 focus:bg-primary/20": color === "primary",
						"text-secondary border-secondary hover:bg-secondary/10 focus:bg-secondary/20": color === "secondary",
						"text-danger border-danger hover:bg-danger/10 focus:bg-danger/20": color === "danger",
						"text-warning border-warning hover:bg-warning/10 focus:bg-warning/20": color === "warning",
						"text-success border-success hover:bg-success/10 focus:bg-success/20": color === "success",
						"text-info border-info hover:bg-info/10 focus:bg-info/20": color === "info",
					},
				],
				variant === "ghost" && [
					"backdrop-blur-md shadow-lg",
					{
						"text-black dark:text-white bg-primary-200 hover:bg-primary-300/90 focus:bg-primary-300 dark:bg-primary-800 dark:hover:bg-primary-900/90 dark:focus:bg-primary-900": color === "primary",
						"text-black dark:text-white bg-secondary-200 hover:bg-secondary-300/90 focus:bg-secondary-300 dark:bg-secondary-800 dark:hover:bg-secondary-900/90 dark:focus:bg-secondary-900":
							color === "secondary",
						"text-black dark:text-white bg-danger-200 hover:bg-danger-300/90 focus:bg-danger-300 dark:bg-danger-800 dark:hover:bg-danger-900/90 dark:focus:bg-danger-900": color === "danger",
						"text-black dark:text-white bg-warning-200 hover:bg-warning-300/90 focus:bg-warning-300 dark:bg-warning-800 dark:hover:bg-warning-900/90 dark:focus:bg-warning-900": color === "warning",
						"text-black dark:text-white bg-success-200 hover:bg-success-300/90 focus:bg-success-300 dark:bg-success-800 dark:hover:bg-success-900/90 dark:focus:bg-success-900": color === "success",
						"text-black dark:text-white bg-info-200 hover:bg-info-300/90 focus:bg-info-300 dark:bg-info-800 dark:hover:bg-info-900/90 dark:focus:bg-info-900": color === "info",
					},
				],
				variant === "link" && [
					"hover:underline focus:underline",
					{
						"text-primary hover:text-primary-400 dark:hover:text-primary-600 focus:text-primary-400 dark:focus:text-primary-600": color === "primary",
						"text-secondary hover:text-secondary-400 focus:text-secondary-400 dark:hover:text-secondary-600 dark:focus:text-secondary-600": color === "secondary",
						"text-danger hover:text-danger-400 focus:text-danger-400 dark:hover:text-danger-600 dark:focus:text-danger-600": color === "danger",
						"text-warning hover:text-warning-400 focus:text-warning-400 dark:hover:text-warning-600 dark:focus:text-warning-600": color === "warning",
						"text-success hover:text-success-400 focus:text-success-400 dark:hover:text-success-600 dark:focus:text-success-600": color === "success",
						"text-info hover:text-info-400 focus:text-info-400 dark:hover:text-info-600 dark:focus:text-info-600": color === "info",
					},
				],
				variant === "text" && {
					"text-primary hover:bg-primary/10 focus:bg-primary/20": color === "primary",
					"text-secondary hover:bg-secondary/10 focus:bg-secondary/20": color === "secondary",
					"text-danger hover:bg-danger/10 focus:bg-danger/20": color === "danger",
					"text-warning hover:bg-warning/10 focus:bg-warning/20": color === "warning",
					"text-success hover:bg-success/10 focus:bg-success/20": color === "success",
					"text-info hover:bg-info/10 focus:bg-info/20": color === "info",
				},
				className
			)}
			onClick={handleOnClick}
			{...restProps}
		>
			{ripple && variant !== "link" && (
				<span className="absolute w-full h-full rounded-[inherit] overflow-hidden">
					{rippleMap.map(({ x, y, size }, i) => (
						<span key={i} className="absolute rounded-full animate-ripple opacity-0 bg-black/50 dark:bg-white/50" style={{ left: x, top: y, width: size, height: size }} />
					))}
				</span>
			)}
			{isLoading ? "Loading..." : children}
		</Btn>
	)
}
