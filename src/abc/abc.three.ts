import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Mesh, MeshBasicMaterial } from 'three'

export default function (canvas: HTMLCanvasElement) {

    // Canvas
    if (!canvas) throw new Error("couldn't locate canvas")

    // Dimensions
    const width = window.innerWidth
    const height = window.innerHeight * 0.5
    const aspectRatio = width / height
    const FOV = 75

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

    // Material
    // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

    const alphabetGeometry: TextGeometry[] = []
    const alphabetMesh: Mesh[] = []
    const red = new MeshBasicMaterial({ color: 'red' })
    const green = new MeshBasicMaterial({ color: 'green' })
    const yellow = new MeshBasicMaterial({ color: 'yellow' })
    const blue = new MeshBasicMaterial({ color: 'blue' })
    const pink = new MeshBasicMaterial({ color: 'pink' })
    const white = new MeshBasicMaterial({ color: '#eee' })
    const alphabetColors: MeshBasicMaterial[] = [
        red, green, yellow, blue, pink
    ]

    // Text
    const fontLoader = new FontLoader()

    fontLoader.load(
        '/src/assets/fonts/helvetiker_regular.typeface.json',
        (font) => {
            const textGeometry = new TextGeometry(
                "Kyle's English Academy",
                {
                    font,
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

            const text = new THREE.Mesh(textGeometry, white)
            scene.add(text)

            for (let char = 'a'.charCodeAt(0); char <= 'z'.charCodeAt(0); char++) {
                const letter = createLetterGeometry(font, String.fromCharCode(char))
                alphabetGeometry.push(letter)
            }

            for (let char = 'A'.charCodeAt(0); char <= 'Z'.charCodeAt(0); char++) {
                const letter = createLetterGeometry(font, String.fromCharCode(char))
                alphabetGeometry.push(letter)
            }

            for (let char = '0'.charCodeAt(0); char <= '9'.charCodeAt(0); char++) {
                const letter = createLetterGeometry(font, String.fromCharCode(char))
                alphabetGeometry.push(letter)
            }

            for (let i = 0; i < 1000; i++) {
                const randomElement = Math.floor(Math.random() * alphabetGeometry.length)
                const randomColor = Math.floor(Math.random() * alphabetColors.length)

                // alphabetGeometry.forEach(textGeometry => {
                const letter = new THREE.Mesh(alphabetGeometry[randomElement], alphabetColors[randomColor])
                letter.position.x = (Math.random() - 0.5) * 100
                letter.position.y = (Math.random() - 0.5) * 100
                letter.position.z = (Math.random() - 0.5) * 100
                letter.rotation.x = Math.random() * Math.PI
                letter.rotation.y = Math.random() * Math.PI
                alphabetMesh.push(letter)
                letter.geometry.center()
                scene.add(letter)
            };

        }
    )

    const createLetterGeometry = (font: Font, letter: string): TextGeometry => {
        const textGeometry = new TextGeometry(
            letter,
            {
                font,
                size: 2.0,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        return textGeometry
    }

    // Clock
    const clock = new THREE.Clock()

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setSize(width, height)

    // Animations
    const tick = () => {
        const delta = clock.getDelta()
        control.update()
        alphabetMesh.forEach(mesh => {
            mesh.rotation.y += (0.5 * delta)
            mesh.rotation.z += (0.5 * delta)
        });
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    }

    // Run
    clock.start()
    tick()

}