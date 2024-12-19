import { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react"

export type PolymorphicAsProp<E extends ElementType> = {
	as?: E
}

export type PolymorphicProps<E extends ElementType> = Omit<PropsWithChildren<ComponentPropsWithoutRef<E>>, "as"> & PolymorphicAsProp<E>

export type PageErrorProps = {
	error: Error
	reset: () => void
}

export type LayoutProps<P = any> = {
	params: PageParams<P>
	children: React.ReactNode
}

export type PageProps<P = any, S = any> = {
	params: PageParams<P>
	searchParams: PageParams<S>
}

export type PageParams<P = any> = {
	[K in keyof P]: P[K]
}
