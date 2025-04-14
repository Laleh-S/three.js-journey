//! NOTES:
// Different Types of Tweaks:
// - Range — for numbers with minimum and maximum value
// - Color — for colors with various formats
// - Text — for simple texts
// - Checkbox — for booleans (true or false)
// - Select — for a choice from a list of values
// - Button — to trigger functions


//TODO --> VERY IMPORTANT:
// ADD your tweks as you progress. 
// Don't wait for the end of the project to add the tweaks because it would be too late.
// We will miss oportunities to find better values.
// If you add an object with color, we add a tweak for color.
// If you add lights, then we add a tweak for the intensity of light and the color of the light.


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui' // <- Install before importing.

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Debug
// ≋≋≋≋≋≋≋≋≋≋≋≋
// Instantiate lil-gui
const gui = new GUI({
    width: 300, 
    title:'My First Debu UI',
    closeFolders: true
}) 

// gui.close() // Closes UI by default.
// gui.hide() // Hides the UI 
window.addEventListener('keydown', (event) => {
    if (event.key == 'h'){ // when pressing 'h'
        gui.show(gui._hidden) // Shows or hides UI 
    }
})

const debugObject = {
}


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Base
// ≋≋≋≋≋≋≋≋≋≋≋≋

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Canvas
// ≋≋≋≋≋≋≋≋≋≋≋≋
const canvas = document.querySelector('canvas.webgl')


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Scene
// ≋≋≋≋≋≋≋≋≋≋≋≋
const scene = new THREE.Scene()


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Object
// ≋≋≋≋≋≋≋≋≋≋≋≋
debugObject.color = '#7da72f'

// Instantiating geometry, material and mesh.
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// Tweaks
// Most of the tweaks can be added using gui.add(...) 
// Parameter:
// 1- The object
// 2- the properties of that object


// Creating Folder for our tweaks:
const cubeTweaks = gui.addFolder('My awsome folder') // Creating folder inside our debug
// cubeTweaks.close() // Closes the folder by default


// - Range Tweak:
// Lil-gui can only tweaks properties of an object.
// mesh.position -> is the object and y -> is the property.
cubeTweaks
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevetion')


// - Checkbox Tweak:
cubeTweaks.add(mesh, 'visible')

cubeTweaks.add(material, 'wireframe')


// - Color Tweak:
cubeTweaks
    .addColor(debugObject, 'color')
    .onChange(() => {
        material.color.set(debugObject.color)
    })

// Button Function Tweak:
//gui.add() expects to work with Object and the properties of that object, we put our function inside the debugObject which we created.
debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 }) // Math.PI half a circle and *2 for full circle.
}
gui.add(debugObject, 'spin')


// Geometry Tweak:
debugObject.subdivision = 2
gui
    .add(debugObject, 'subdivision') // Name it subdivision so we can use it on all width, height and depth segments.
    .min(1)
    .max(20)
    .step(1)
    // When tweak value changes, we are distroying the old geometry and build a new one.
    // onFinishChange ensures your app reacts only to the final value, not every intermediate change.
    .onFinishChange(() => {  // Reacts only when we stop tweaking the value.
        // We must call a dispose() method on the old geometry before building a new one.
        geometry.dispose() // Very important for the performance.

        // Bulding a brand new geometry.
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1, // Box sizes ->  width, height, depth 
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision) 
            // The old geometries are still sitting in the GPU memory. Dispose it
    })


  

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Sizes
// ≋≋≋≋≋≋≋≋≋≋≋≋
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ≋≋≋≋≋≋≋≋≋≋≋≋
// Camera
// ≋≋≋≋≋≋≋≋≋≋≋≋

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Controls
// ≋≋≋≋≋≋≋≋≋≋≋≋
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Renderer
// ≋≋≋≋≋≋≋≋≋≋≋≋
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// ≋≋≋≋≋≋≋≋≋≋≋≋
// Animate
// ≋≋≋≋≋≋≋≋≋≋≋≋
const clock = new THREE.Clock() // In the latest verion of three.js we have access to new version of clock called timer

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()