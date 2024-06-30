"use client"
import { useRef } from "react"

export function useDebounce(delay: number) {
    const timer = useRef<NodeJS.Timeout>()

    return (fn: (...args: any[]) => void, ...args: any[]) => {
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export function useDebounceMap(delay: number) {
    const timers = useRef<Record<string, NodeJS.Timeout>>({})

    return (key: string, fn: (...args: any[]) => void, ...args: any[]) => {
        if (timers.current[key]) clearTimeout(timers.current[key])
        timers.current[key] = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}
