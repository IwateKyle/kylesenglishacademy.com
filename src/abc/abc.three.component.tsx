import abc from './abc.three'
import { onMount } from "solid-js"


export const ABC3D = () => {
    let myCanvas: HTMLCanvasElement
    onMount(() => { abc(myCanvas) })
    const fullScreen = () => { myCanvas.requestFullscreen() }

    return (
        <canvas ref={myCanvas} ondblclick={fullScreen}></canvas>
    )
}