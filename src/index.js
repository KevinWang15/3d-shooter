import * as THREE from "three";
import * as models from "./models";
import setUpEnvironment, { meshes } from "./methods/setUpEnvironment";
import "./index.css";

let keydown = {};
let speed = { x: 0.1, y: 0 };
let inertia = { x: 0, z: 0 };
let isJumping = false;
let isShooting = false;
let hasBullet = false;
let bullets = [];
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1000 / 800, 0.1, 100);
let loadingManager = new THREE.LoadingManager();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(1000, 800);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
models.load(loadingManager).then(function () {
  setUpEnvironment(scene);
  document.body.appendChild(renderer.domElement);
  camera.lookAt(meshes["tree1"].position);
  camera.position.y += 2;
  renderer.domElement.onclick = () => {
    renderer.domElement.requestPointerLock()
  };
  updateCameraAndGun({ movementX: 0, movementY: 0 });
  animate();
});

document.addEventListener('mousemove', (e) => {
  updateCameraAndGun(e);
});
document.addEventListener('keydown', (e) => {
  keydown[e.keyCode] = true;
  if (e.keyCode === 32) {
    isJumping = true;
    speed.y += 10;
  }
});
document.addEventListener('keyup', (e) => {
  keydown[e.keyCode] = false;
});

document.addEventListener('mousedown', (e) => {
  console.log("isShooting", true);
  isShooting = true;
});

document.addEventListener('mouseup', (e) => {
  console.log("isShooting", false);
  isShooting = false;
});

let prevTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  let time = performance.now();
  let delta = ( time - prevTime ) / 1000;
  prevTime = time;
  renderer.render(scene, camera);
  if (isShooting && hasBullet)
    shootBullet();
  updateBullets();
  updateCameraAndGun();
  updatePlayerPos(delta);
  updateCameraAndGun()
}

function updateCameraAndGun(event = { movementX: 0, movementY: 0 }) {
  camera.rotation.y += event.movementX * 0.002;
  if (meshes.gun) {
    let time = Date.now() * 0.0005;
    meshes.gun.position.set(
      camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.75,
      camera.position.y - 0.5 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.05,
      camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.75,
    );

    meshes.gun.rotation.set(
      camera.rotation.x,
      camera.rotation.y - Math.PI,
      camera.rotation.z,
    );
  }
}
function updateBullets() {
  bullets = bullets.filter(_ => _.alive);
  bullets.forEach((bullet, index) => {
    bullet.position.add(bullet.velocity);
  });
}
function shootBullet() {
  let bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffAA }),
  );
  bullet.position.set(
    meshes.gun.position.x,
    meshes.gun.position.y + 0.15,
    meshes.gun.position.z,
  );
  bullet.velocity = new THREE.Vector3(
    -Math.sin(camera.rotation.y),
    0,
    Math.cos(camera.rotation.y),
  );
  bullet.alive = true;
  bullets.push(bullet);
  setTimeout(() => {
    bullet.alive = false;
    scene.remove(bullet);
  }, 600);
  scene.add(bullet);
  hasBullet = false;
}
function updatePlayerPos(delta) {
  camera.position.y += speed.y * delta;
  if (camera.position.y > 2) {
    speed.y += delta * (-50);
  } else {
    speed.y = 0;
    camera.position.y = 2;
    inertia.x = 0;
    inertia.z = 0;
    isJumping = false;
  }
  if (!isJumping) {
    if (!keydown[32]) {
      inertia.x = 0;
      inertia.z = 0;
    }
    if (keydown[87]) { //w
      inertia.x += -Math.sin(camera.rotation.y) * speed.x;
      inertia.z += Math.cos(camera.rotation.y) * speed.x;
    }
    if (keydown[83]) { //s
      inertia.x += -Math.sin(camera.rotation.y) * -speed.x;
      inertia.z += Math.cos(camera.rotation.y) * -speed.x;
    }
    if (keydown[65]) { // a
      inertia.x += Math.sin(camera.rotation.y + Math.PI / 2) * speed.x;
      inertia.z += -Math.cos(camera.rotation.y + Math.PI / 2) * speed.x;
    }
    if (keydown[68]) { // d
      inertia.x += Math.sin(camera.rotation.y + Math.PI / 2) * -speed.x;
      inertia.z += -Math.cos(camera.rotation.y + Math.PI / 2) * -speed.x;
    }
  }
  let sumxz = Math.sqrt(inertia.x / speed.x * inertia.x / speed.x + inertia.z / speed.x * inertia.z / speed.x);
  if (sumxz) {
    let normalizedx = inertia.x / sumxz;
    camera.position.x += normalizedx;
    let normalizedz = inertia.z / sumxz;
    camera.position.z += normalizedz;
  }
};
setInterval(() => {
  hasBullet = true;
}, 100);