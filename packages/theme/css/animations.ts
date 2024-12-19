export const Animations = {
	outline: "outline 6s linear infinite",
}

export const KeyFrames = {
	outline: {
		"0%, 100%": {
			top: "0",
			left: "0",
			transform: "translateX(0) translateY(0)",
			width: "15px",
			height: "15px",
		},

		"21%": {
			width: "50px",
			height: "10px",
		},

		"42%": {
			top: "0",
			left: "100%",
			transform: "translateX(-100%) translateY(0)",
			width: "15px",
			height: "15px",
		},
		"50%": {
			top: "100%",
			left: "100%",
			transform: "translateX(-100%) translateY(-100%)",
			width: "15px",
			height: "15px",
		},

		"71%": {
			width: "50px",
			height: "10px",
		},

		"92%": {
			top: "100%",
			left: "0",
			transform: "translateX(0) translateY(-100%)",
			width: "15px",
			height: "15px",
		},
	},
}
