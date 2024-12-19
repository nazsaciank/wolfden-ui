export const blue = (text) => `\x1b[34m${text}\x1b[0m`
export const green = (text) => `\x1b[32m${text}\x1b[0m`
export const red = (text) => `\x1b[31m${text}\x1b[0m`
export const yellow = (text) => `\x1b[33m${text}\x1b[0m`
export const cyan = (text) => `\x1b[36m${text}\x1b[0m`
export const magenta = (text) => `\x1b[35m${text}\x1b[0m`
export const white = (text) => `\x1b[37m${text}\x1b[0m`
export const black = (text) => `\x1b[30m${text}\x1b[0m`

export const bgBlue = (text) => `\x1b[44m${text}\x1b[0m`
export const bgGreen = (text) => `\x1b[42m${text}\x1b[0m`
export const bgRed = (text) => `\x1b[41m${text}\x1b[0m`
export const bgYellow = (text) => `\x1b[43m${text}\x1b[0m`
export const bgCyan = (text) => `\x1b[46m${text}\x1b[0m`
export const bgMagenta = (text) => `\x1b[45m${text}\x1b[0m`
export const bgWhite = (text) => `\x1b[47m${text}\x1b[0m`
export const bgBlack = (text) => `\x1b[40m${text}\x1b[0m`

export const large = (text) => `\x1b[1m\x1b[37m\x1b[44m${text}\x1b[0m`
export const small = (text) => `\x1b[2m${text}\x1b[0m`
export const normal = (text) => `\x1b[22m${text}\x1b[0m`

export const bold = (text) => `\x1b[1m${text}\x1b[0m`
export const italic = (text) => `\x1b[3m${text}\x1b[0m`
export const underline = (text) => `\x1b[4m${text}\x1b[0m`
export const inverse = (text) => `\x1b[7m${text}\x1b[0m`

export function args() {
	const argv = process.argv.splice(2)
	const args = {}
	if (argv.length > 0) {
		argv.forEach((arg) => {
			if (arg.includes("=")) {
				let [key, value] = arg.split(":")
				if (value === "null") value = null
				if (value === "true") value = true
				if (value === "false") value = false
				args[key] = value
				return
			}
			args[arg] = true
		})
	}
	return args
}

export function exec(command, options = { stdio: true }) {
	return new Promise(async (resolve, reject) => {
		if (!command) return resolve()
		const { stdio } = options
		const { spawn } = await import("child_process")
		const execute = spawn(command, { shell: true, stdio: stdio ? "inherit" : "pipe" })
		execute.on("close", (code) => (code === 0 ? resolve() : reject(code)))
	})
}
