import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader"
import { OrbitControls } from "three/addons/controls/OrbitControls"


const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))
var doc = document.getElementById("3dcar");

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(.5,1.7,5.5)
console.log("updated bas vasco")
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
renderer.shadowMap.enabled = true
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(window.innerWidth/2,window.innerHeight/2)
renderer.setClearColor(0x000000,1);
doc.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

console.log("update vasco 5")
const Light = new THREE.AmbientLight(0xffffff, 4)
scene.add(Light)
let spotLight = new THREE.SpotLight(0xffffff,50);
spotLight.position.set(5, 2, 2);
scene.add(spotLight);

// key i +intensity j -intensity



const loader = new GLTFLoader()
loader.load(
  "models/scene.glb",
  function(gltf) {
    gltf.scene.traverse(function(child) {
      if (child.isMesh) {
        const m = child
        m.receiveShadow = true
        m.castShadow = true
      }
      if (child.isLight) {
        const l = child
        l.castShadow = false
        l.shadow.bias = -0.003
        l.shadow.mapSize.width = 2048
        l.shadow.mapSize.height = 2048
      }
    })
    scene.add(gltf.scene)
  },
  xhr => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
  },
  error => {
    console.log(error)
  }
)

window.addEventListener("resize", onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}

animate()
