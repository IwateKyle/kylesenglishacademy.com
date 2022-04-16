import { children } from "solid-js"
import { PropsWithChildren } from "solid-js"

export const MainHeader = (props: PropsWithChildren) => {
    return (
        <>
            <h1>Kyle's English Academy</h1>
            {props.children}
        </>
    )
}