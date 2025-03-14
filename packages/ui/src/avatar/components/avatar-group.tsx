import { classnames } from "@wolfden-ui/system"
import React from "react"

export type AvatarGroupProps = React.ComponentProps<"div"> & {}

export function AvatarGroup({ className, children, ...props }: AvatarGroupProps) {
	return (
		<div className={classnames("flex space-x-2")} {...props}>
			{children}
		</div>
	)
}
