"use client"
import { classnames, PolymorphicProps } from "@wolfden-ui/system"
import { ElementType, forwardRef, RefAttributes, useMemo } from "react"
import { AVATAR_SIZING } from "../constants"
import { AvatarIcon } from "./avatar-icon"

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

export type AvatarColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger"

export type AvatarProps<E extends ElementType = "img"> = PolymorphicProps<E> & {
	name?: string

	icon?: React.ReactNode

	isBordered?: boolean

	size?: AvatarSize

	color?: AvatarColor
}

export const Avatar = forwardRef(function Avatar<E extends ElementType = "img">(avatarProps: AvatarProps<E>, ref: React.ForwardedRef<HTMLImageElement>) {
	const { as, src, alt, icon = <AvatarIcon className="w-5 h-5" />, name, isBordered, color = "default", size = "md", className, ...props } = avatarProps
	const Image = useMemo(() => as || (src ? "img" : "div"), [as, src])

	const fallback = useMemo(() => {
		if (!name) return ""
		const [firstName, lastName] = name.split(" ")
		return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.toUpperCase()
	}, [name])

	return (
		<div
			className={classnames(
				"flex-shrink-0 relative inline-flex justify-center items-center rounded-full overflow-hidden shadow z-0",
				{
					"ring-2 ring-offset-2": isBordered,
					"w-6 h-6": size === "xs",
					"w-8 h-8": size === "sm",
					"w-10 h-10": size === "md",
					"w-14 h-14": size === "lg",
					"w-20 h-20": size === "xl",
					"ring-default": color === "default" && isBordered,
					"ring-primary": color === "primary",
					"ring-secondary": color === "secondary",
					"ring-success": color === "success",
					"ring-warning": color === "warning",
					"ring-danger": color === "danger",
				},
				className
			)}
		>
			{src && <Image ref={ref} className={classnames("relative h-full object-contain z-20 bg-white dark:bg-black")} src={src} width={AVATAR_SIZING[size]} height={AVATAR_SIZING[size]} alt={alt} {...props} />}
			<span
				className={classnames("absolute select-none inset-0 rounded-full flex items-center justify-center text-center z-10", {
					"bg-default text-default-foreground": color === "default",
					"bg-primary text-primary-foreground": color === "primary",
					"bg-secondary text-secondary-foreground": color === "secondary",
					"bg-success text-success-foreground": color === "success",
					"bg-warning text-warning-foreground": color === "warning",
					"bg-danger text-warning-foreground": color === "danger",
					"text-xs font-normal": size === "xs" || size === "sm",
					"text-sm font-medium": size === "md" || size === "lg",
					"text-medium font-bold": size === "xl",
				})}
			>
				{fallback || icon || alt}
			</span>
		</div>
	)
}) as <E extends ElementType = "img">(props: AvatarProps<E> & RefAttributes<HTMLImageElement>) => JSX.Element
