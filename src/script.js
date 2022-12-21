import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'


/**
 * Debug 控制器
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#0bbce0'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })
    
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
//Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshPhongMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture
})
// Other Meshes - plane, sphere, box

const meshPlane = new THREE.PlaneGeometry(2, 2.5)
const planeMaterial = new THREE.MeshBasicMaterial( { color: '#E4F9FA' } )
const plane = new THREE.Mesh( meshPlane, planeMaterial )
plane.position.x = 1
plane.position.z = -0.5
scene.add(plane)


const meshSphere = new THREE.SphereGeometry(0.4, 32, 16)
const sphereMaterial = new THREE.MeshPhongMaterial( { color: '#E0A0F5' } )
const sphere = new THREE.Mesh( meshSphere, sphereMaterial )
sphere.position.y = 1.1
sphere.position.x = 1.6
scene.add(sphere)

const meshSphere2 = new THREE.SphereGeometry(0.3, 32, 16)
const sphereMaterial2 = new THREE.MeshPhongMaterial( { color: '#FFAB45' } )
const sphere2 = new THREE.Mesh( meshSphere2, sphereMaterial2 )
sphere2.position.y = - 1.2
sphere2.position.x = 1.5
scene.add(sphere2)

const meshBox = new THREE.BoxGeometry(0.6, 0.3, 1)
const boxMaterial = new THREE.MeshPhongMaterial( { color: '#FFA6A6' } )
const box = new THREE.Mesh( meshBox, boxMaterial )
box.position.x = 0.4
box.position.y = - 0.6
scene.add(box)

const meshTorus = new THREE.TorusGeometry(0.2, 0.1 , 64, 100)
const torusMaterial = new THREE.MeshPhongMaterial( { color: '#e00b92' } )
const torus = new THREE.Mesh( meshTorus, torusMaterial )
torus.position.x = 0.5
torus.position.y = 0.5
scene.add(torus)

const otherMeshes = [box, torus]
const sphereMeshes = [sphere, sphere2, plane]

// Meshes
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 1, 32),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 1),
    material
)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

mesh1.position.z = 1

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1,  mesh2, mesh3]

/**
 * Particles 粒子
 */ 
//Geometry
const particlesCount = 200 // 粒子數量
const positions = new Float32Array(particlesCount * 3)

//  for 迴圈來建立每個粒子的三維座標。這些座標是隨機生成的，並存儲在 positions 陣列中。
for(let i = 0; i < particlesCount; i++){
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.05
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.position.set(0.5, 3, 3)
scene.add(directionLight)

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+= 6',
                y: '+= 3',
                z: '+= 1.5'
            }
        )
    }
    gsap.to(

    )
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY /sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    for(const mesh of otherMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()