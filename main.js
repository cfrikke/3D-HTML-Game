// Create the scene
const scene = new THREE.Scene();
const r = -Math.PI / 2;
let moveSpeed = 0.1;
let canMove = true;
let PlayerThirdPerson = false;
let PlayerTempY;
let PlayerTempRX;
let PlayerTempRY;
let PlayerTempRZ;
let PlayerThirdPersonToggle = true;
let canThirdPerson = true;

// Create the Player
const Player = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const helper = new THREE.CameraHelper(Player);
//scene.add( helper );

Player.position.set(0, 1.6, 0); // Set initial Player position
Player.rotation.y = r - 0.75;

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb); // Set the background color to sky blue
document.getElementById('game-container').appendChild(renderer.domElement);




// Create the floor
const geometry2 = new THREE.BoxGeometry(10, 1, 10);
const material = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 });
const floor = new THREE.Mesh(geometry2, material);
floor.position.x = 0;
floor.position.z = 0;
floor.position.y = 0;
scene.add(floor);

var WhiteBox1 = new THREE.Box3(
  new THREE.Vector3(-5, 0, -5), // Minimum point
  new THREE.Vector3(5, 100, 5)   // Maximum point
);
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
var BoxMin = WhiteBox1.min.clone();
var BoxMax = WhiteBox1.max.clone();
var moveDirection = 1; // 1 for moving towards the maximum point, -1 for moving towards the minimum point
box.position.y = 1;
box.geometry.computeBoundingBox();
scene.add(box);

var Player3PBox = new THREE.Box3();
const Player3P = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
Player3P.position.y = 0;
Player3P.geometry.computeBoundingBox();
scene.add(Player3P);

const PlayerMin = new THREE.Vector3(-5, 1, -5); // Minimum point
const PlayerMax = new THREE.Vector3(5, 100, 5); // Maximum point
const WallBox = new THREE.BoxGeometry(1, 2, 1);
const WallColor = new THREE.MeshBasicMaterial({ color: 0x9f9f9f });
const Wall = new THREE.Mesh(WallBox, WallColor);
Wall.position.x = 2;
Wall.position.y = 1;
Wall.position.z = 2;
scene.add(Wall);


// Handle keyboard input for camera movement
const keyboard = {};
document.addEventListener('keydown', (event) => {
  keyboard[event.code] = true;
});
document.addEventListener('keyup', (event) => {
  keyboard[event.code] = false;
});

// Update the overlay content
function updateOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.textContent = 'This is an overlay';
}

// Animation loop
function animate() {
  WhiteBox1.copy(box.geometry.boundingBox).applyMatrix4(box.matrixWorld);
  requestAnimationFrame(animate);
  //BoxPositionX = box.position.x+(0.5*(box.width));

  if (Player.position.x >= PlayerMax.x){
    Player.position.x = PlayerMax.x;
  }
  if(Player.position.x <= PlayerMin.x){
    Player.position.x = PlayerMin.x;
  }
  if (Player.position.z >= PlayerMax.z){
    Player.position.z = PlayerMax.z;
  }
  if(Player.position.z <= PlayerMin.z){
    Player.position.z = PlayerMin.z;
  }
  if (Player.position.y >= PlayerMax.y && !PlayerThirdPerson){
    Player.position.y = PlayerMax.y;
  }
  if(Player.position.y <= PlayerMin.y && !PlayerThirdPerson){
    Player.position.y = PlayerMin.y;
  }

  
 // Define the size of the player and wall
var playerSize = 1;
var wallSize = 1;

// Calculate the half sizes for easier collision detection
var halfPlayerSize = playerSize / 2;
var halfWallSize = wallSize / 2;

// Check for collision with the wall
if ((Player.position.z + halfPlayerSize > Wall.position.z - halfWallSize && Player.position.z + halfPlayerSize < Wall.position.z + halfWallSize)&&(Player.position.x + halfPlayerSize > Wall.position.x - halfWallSize && Player.position.x - halfPlayerSize < Wall.position.x + halfWallSize)) {
  //Player.position.z -= moveSpeed;
}
if ((Player.position.z - halfPlayerSize < Wall.position.z + halfWallSize && Player.position.z + halfPlayerSize > Wall.position.z - halfWallSize)&&(Player.position.x + halfPlayerSize > Wall.position.x - halfWallSize && Player.position.x - halfPlayerSize < Wall.position.x + halfWallSize)) {
  //Player.position.z += moveSpeed;
}

if ((Player.position.x - halfPlayerSize < Wall.position.x + halfWallSize && Player.position.x + halfPlayerSize > Wall.position.x - halfWallSize)&&(Player.position.z + halfPlayerSize > Wall.position.z - halfWallSize && Player.position.z - halfPlayerSize < Wall.position.z + halfWallSize)) {
  //Player.position.x += moveSpeed;
}

  Player3P.position.x = Player.position.x;
  Player3P.position.z = Player.position.z;


    box.position.x += 0.1 * moveDirection; // Example movement increment

    // Check if the position reaches the bounds
    if (box.position.x >= BoxMax.x || box.position.x <= BoxMin.x) {
      moveDirection *= -1; // Reverse the movement direction
    }

  
    // Update the box with the new position
    //WhiteBox1.setFromPoints([currentPosition]);
  // Handle Player movement
  const rotateAngle = Player.rotation.y;

  if (keyboard['KeyW']) {
    if(canMove){
    Player.position.z -= moveSpeed * Math.cos(rotateAngle);
    Player.position.x -= moveSpeed * Math.sin(rotateAngle);
  }
}
  if (keyboard['KeyS']) {
    if(canMove){
    Player.position.z += moveSpeed * Math.cos(rotateAngle);
    Player.position.x += moveSpeed * Math.sin(rotateAngle);
  }
}
  if (keyboard['KeyA']) {
    if(canMove){
    Player.position.z += moveSpeed * Math.sin(rotateAngle);
    Player.position.x -= moveSpeed * Math.cos(rotateAngle);
  }
}
  if (keyboard['KeyD']) {
    if ((Player.position.x + halfPlayerSize > Wall.position.x - halfWallSize && Player.position.x + halfPlayerSize < Wall.position.x + halfWallSize)&&(Player.position.z + halfPlayerSize > Wall.position.z - halfWallSize && Player.position.z - halfPlayerSize < Wall.position.z + halfWallSize)) {
      moveSpeed = 0;
    }else{
      moveSpeed = 0.1;
    }
    Player.position.z -= moveSpeed * Math.sin(rotateAngle);
    Player.position.x += moveSpeed * Math.cos(rotateAngle);
  
}
  if (keyboard['Space']) {
    if(!PlayerThirdPerson){
    Player.position.y -= moveSpeed * Math.cos(rotateAngle);
    }
  }
  if (keyboard['ShiftLeft']) {
    if(!PlayerThirdPerson){
    Player.position.y += moveSpeed * Math.cos(rotateAngle);
  }
}
  if(keyboard['KeyF']) {
    if(canThirdPerson){
    if(PlayerThirdPersonToggle){
    PlayerThirdPerson = true;
    PlayerTempY = Player.position.y;
    PlayerTempRX = Player.rotation.x;
    PlayerTempRY = Player.rotation.y;
    PlayerTempRZ = Player.rotation.z;
    Player.position.y = 5;
    Player.rotation.x = r;
    Player.rotation.z = 0;
    Player.rotation.y = 0;
    PlayerThirdPersonToggle = false;
    }else{
      PlayerThirdPerson = false;
      Player.position.y = PlayerTempY;
      Player.rotation.x = PlayerTempRX;
      Player.rotation.y = PlayerTempRY;
      Player.rotation.z = PlayerTempRZ;
      PlayerThirdPersonToggle = true;
    }
    canThirdPerson = false;
    document.addEventListener('keyup',function(e){
      if(e.key = "KeyF"){
        canThirdPerson = true;
      }
    });
  }
}

  const RotateSpeed = 0.05;
  if (keyboard['ArrowLeft']) Player.rotation.y += Math.sin(RotateSpeed);
  if (keyboard['ArrowRight']) Player.rotation.y -= RotateSpeed;
  //if (keyboard['ArrowDown']) camera.rotation.z += RotateSpeed;
  //if (keyboard['ArrowDown']) camera.rotation.x += RotateSpeed;

  // Update the overlay


  // Render the scene
  renderer.render(scene, Player);
}

// Start the animation loop
animate();
