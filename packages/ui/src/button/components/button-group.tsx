import { classnames } from "@wolfden-ui/system"
import React from "react"

export type ButtonGroupProps = React.ComponentProps<"div"> & {}

export function ButtonGroup({ className, children }: ButtonGroupProps) {
	return <div className={classnames("relative inline-flex btn-group", className)}>{children}</div>
}
