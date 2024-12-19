import fs from "fs"
import inquirer from "inquirer"
import { QUESTION_PUBLISH } from "./contants.mjs"
import { blue, exec, green } from "./utils.mjs"

async function publish() {
	console.clear()
	try {
		const { name } = getPackageJson()

		console.log(`\n${blue(name)}\n`)

		const answars = await inquirer.prompt(QUESTION_PUBLISH)
		if (!answars.publish) return

		if (answars.isChangeVersion) {
			await exec(`npm version ${answars.version}`, { stdio: false })
			const { version } = getPackageJson()
			console.log(green(`Changed version to ${blue(version)}\n`))
		}

		await exec(`npm run build`)
		await exec(`npm publish`)
	} catch (error) {
		console.log("Algo salio mal", error)
	}
}

function getPackageJson() {
	const packageJson = fs.readFileSync("./package.json", "utf-8")
	return JSON.parse(packageJson)
}

publish()
