import plugin from "tailwindcss/plugin"
import colors from "./colors"
import { Animations, KeyFrames } from "./css/animations"
import { BoxShadows } from "./css/box-shadow"

export const wolfdenui = function () {
	return plugin(
		function ({ addVariant, addBase, addComponents }) {
			// Add color palette
		},
		{
			theme: {
				extend: {
					boxShadow: { ...BoxShadows },
					animation: { ...Animations },
					keyframes: { ...KeyFrames },
					colors: { ...colors },
				},
			},
		}
	)
}
