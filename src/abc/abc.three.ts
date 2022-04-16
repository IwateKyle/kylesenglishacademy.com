import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
// import typefaceFont from '../assets/fonts/helvetiker_regular.typeface.json'

export default function (canvas: HTMLCanvasElement) {

    // Canvas
    if (!canvas) throw new Error("couldn't locate canvas")

    // Dimensions
    const width = window.innerWidth
    const height = window.innerHeight * 0.5
    const aspectRatio = width / height
    const FOV = 60

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(FOV, aspectRatio)
    camera.position.z = 5
    scene.add(camera)

    // Events

    // Controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    // Textures
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load('/src/assets/textures/matcaps/8.png')


    // Objects
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'red' }))
    scene.add(cube)

    const fontLoader = new FontLoader()
    const donuts = []

    // Material
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    // Text
    // const helvetica_regular = new Font(typefaceFont)
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

    for (let i = 0; i < 10000; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)
        donut.position.x = (Math.random() - 0.5) * 100
        donut.position.y = (Math.random() - 0.5) * 100
        donut.position.z = (Math.random() - 0.5) * 100
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI
        const scale = Math.random()
        donut.scale.set(scale, scale, scale)

        donuts.push({
            donut,
        })
        scene.add(donut)
    }


    fontLoader.load(
        '/src/assets/fonts/helvetiker_regular.typeface.json',
        (font) => {
            const textGeometry = new TextGeometry(
                'Hello Three.js',
                {
                    // font: font,
                    font ,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            )
            textGeometry.center()

            const text = new THREE.Mesh(textGeometry, material)
            scene.add(text)

            // Donuts
        }
    )

    // Clock
    const clock = new THREE.Clock()

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(width, height)

    // Animations
    const tick = () => {
        control.update()
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    }

    // Run
    clock.start()
    tick()

}