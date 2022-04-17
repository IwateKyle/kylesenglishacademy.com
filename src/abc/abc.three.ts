import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Material, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshToonMaterial } from 'three'
// import typefaceFont from '../fonts/helvetiker_regular.typeface.json?url'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json?url'
import png8 from '../assets/textures/matcaps/8.png?url'

export default function (canvas: HTMLCanvasElement) {

    // Canvas
    if (!canvas) throw new Error("couldn't locate canvas")

    // Dimensions
    const width = window.innerWidth
    const height = window.innerHeight * 0.5
    const aspectRatio = width / height
    const FOV = 40

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('skyblue')

    // Camera
    const camera = new THREE.PerspectiveCamera(FOV, aspectRatio)
    camera.position.z = 5
    scene.add(camera)

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    // const ambientLight = new THREE.AmbientLight()
    const pointLight = new THREE.PointLight(0xcccccc, 2, 500);
    pointLight.position.z = -5
    pointLight.position.y = 5
    scene.add(ambientLight)
    scene.add(pointLight)

    // Events

    // Controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    // Textures
    const textureLoader = new THREE.TextureLoader()
    // const matcapTexture = textureLoader.load('/assets/textures/matcaps/8.png')
    const matcapTexture = textureLoader.load(png8)

    // Material
    // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

    const alphabetGeometry: TextGeometry[] = []
    const alphabetMesh: Mesh[] = []
    // const MyMaterial = MeshBasicMaterial
    const MyMaterial = MeshToonMaterial
    const red = new MyMaterial({ color: 'red' })
    const green = new MyMaterial({ color: 'green' })
    const yellow = new MyMaterial({ color: 'yellow' })
    const blue = new MyMaterial({ color: 'blue' })
    const pink = new MyMaterial({ color: 0xFF69B4})
    const white = new MyMaterial({ color: '#eee' })
    const gray = new MyMaterial({ color: 'darkgray' })
    const alphabetMaterials = [
        red, green, yellow, blue, pink
    ]

    // Text
    const fontLoader = new FontLoader()

    fontLoader.load(
        typefaceFont,
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

            const text = new THREE.Mesh(textGeometry, pink)
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
                const randomColor = Math.floor(Math.random() * alphabetMaterials.length)

                // alphabetGeometry.forEach(textGeometry => {
                const letter = new THREE.Mesh(alphabetGeometry[randomElement], alphabetMaterials[randomColor])
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