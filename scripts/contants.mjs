export const QUESTION_PUBLISH = [
	{
		command: "--publish",
		name: "publish",
		type: "confirm",
		message: "Do you want to publish the package?",
	},
	{
		command: "--change-version",
		name: "isChangeVersion",
		type: "confirm",
		message: "Do you want to change the version of the package?",
		when: (answers) => answers.publish,
	},
	{
		command: "--version",
		name: "version",
		type: "list",
		message: "Select the version of the package",
		when: (answers) => answers.isChangeVersion,
		choices: [
			{
				name: "patch",
				value: "patch",
			},
			{
				name: "minor",
				value: "minor",
			},
			{
				name: "major",
				value: "major",
			},
		],
	},
]
