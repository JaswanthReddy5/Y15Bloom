// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#ff69b4'
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.opacity = Math.random();
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.animation = `float ${Math.random() * 3 + 2}s linear`;
    document.querySelector('.floating-hearts').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create hearts periodically
setInterval(createHeart, 300);

// Initial animations
gsap.from('.birthday-card', {
    duration: 1.5,
    scale: 0,
    ease: 'elastic.out(1, 0.3)',
    delay: 0.5
});

// Start animation loop
animate();

// Add mouse interaction
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    gsap.to(particlesMesh.rotation, {
        x: mouseY * 0.1,
        y: mouseX * 0.1,
        duration: 2
    });
});

// 3D Cake using Three.js
function createCake() {
    const cakeScene = new THREE.Scene();
    const cakeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const cakeRenderer = new THREE.WebGLRenderer({ alpha: true });
    const cakeContainer = document.getElementById('cake-3d');
    cakeRenderer.setSize(220, 220);
    cakeContainer.appendChild(cakeRenderer.domElement);
    cakeCamera.position.z = 6;

    // Cake base
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 1.2, 64);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xffb347 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    cakeScene.add(base);

    // Cake top (icing)
    const topGeometry = new THREE.CylinderGeometry(2.05, 2.05, 0.4, 64);
    const topMaterial = new THREE.MeshPhongMaterial({ color: 0xff69b4 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 0.8;
    cakeScene.add(top);

    // Candle
    const candleGeometry = new THREE.CylinderGeometry(0.12, 0.12, 1, 32);
    const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const candle = new THREE.Mesh(candleGeometry, candleMaterial);
    candle.position.y = 1.4;
    cakeScene.add(candle);

    // Flame
    const flameGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.y = 2;
    cakeScene.add(flame);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    cakeScene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xfff2a1, 1, 100);
    pointLight.position.set(0, 3, 5);
    cakeScene.add(pointLight);

    // Animate cake
    function animateCake() {
        requestAnimationFrame(animateCake);
        base.rotation.y += 0.01;
        top.rotation.y += 0.01;
        candle.rotation.y += 0.01;
        flame.rotation.y += 0.01;
        // Floating effect
        const t = Date.now() * 0.002;
        base.position.y = Math.sin(t) * 0.08;
        top.position.y = 0.8 + Math.sin(t) * 0.08;
        candle.position.y = 1.4 + Math.sin(t) * 0.08;
        flame.position.y = 2 + Math.sin(t * 2) * 0.15;
        // Flicker flame
        flame.scale.set(1 + Math.sin(t * 8) * 0.1, 1 + Math.cos(t * 10) * 0.15, 1);
        cakeRenderer.render(cakeScene, cakeCamera);
    }
    animateCake();
}

window.addEventListener('DOMContentLoaded', createCake);

// Confetti animation
function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    const colors = ['#ff69b4', '#fff', '#ffd700', '#00e6e6', '#ffb347', '#ff5e62', '#7afcff'];
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    confetti.style.opacity = Math.random() * 0.7 + 0.3;
    confetti.style.width = Math.random() * 8 + 6 + 'px';
    confetti.style.height = Math.random() * 16 + 8 + 'px';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.getElementById('confetti').appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
}
let confettiInterval = setInterval(() => {
    for (let i = 0; i < 8; i++) createConfettiPiece();
}, 300);
setTimeout(() => clearInterval(confettiInterval), 6000);

// Balloon animation
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const colors = ['#ff69b4', '#ffd700', '#00e6e6', '#ffb347', '#7afcff'];
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.left = Math.random() * 90 + 'vw';
    balloon.style.animationDuration = (Math.random() * 3 + 4) + 's';
    balloon.style.opacity = Math.random() * 0.5 + 0.5;
    balloon.style.width = Math.random() * 30 + 40 + 'px';
    balloon.style.height = Math.random() * 50 + 60 + 'px';
    document.getElementById('balloons').appendChild(balloon);
    setTimeout(() => balloon.remove(), 8000);
}
setInterval(() => {
    if (Math.random() > 0.5) createBalloon();
}, 800);

// Sparkles around cake
function createSparkle(x, y, parent) {
    const sparkle = document.createElement('div');
    sparkle.className = 'cake-sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    parent.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1200);
}
function animateCakeSparkles() {
    const cake = document.getElementById('cake-3d');
    if (!cake) return;
    for (let i = 0; i < 3; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 90 + Math.random() * 20;
        const x = 110 + Math.cos(angle) * radius;
        const y = 110 + Math.sin(angle) * radius;
        createSparkle(x, y, cake);
    }
    setTimeout(animateCakeSparkles, 400);
}
animateCakeSparkles();

// Add confetti and balloon styles
document.head.insertAdjacentHTML('beforeend', `
<style>
.confetti-piece {
    position: absolute;
    top: 0;
    border-radius: 2px;
    z-index: 11;
    animation: confettiFall linear forwards;
}
@keyframes confettiFall {
    0% { transform: translateY(-10vh) rotate(0deg); }
    100% { transform: translateY(110vh) rotate(360deg); }
}
.balloon {
    position: absolute;
    bottom: -80px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    z-index: 10;
    animation: balloonRise linear forwards;
    box-shadow: 0 8px 20px 0 rgba(0,0,0,0.15);
}
@keyframes balloonRise {
    0% { transform: translateY(0) scale(1); }
    100% { transform: translateY(-110vh) scale(1.1); }
}
.cake-sparkle {
    position: absolute;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle, #fff 60%, #ff69b4 100%);
    opacity: 0.8;
    pointer-events: none;
    animation: sparkleAnim 1.2s linear forwards;
}
@keyframes sparkleAnim {
    0% { opacity: 0.8; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0; transform: scale(0.2); }
}
</style>
`);

// Ensure text is always visible
const styleFix = document.createElement('style');
styleFix.innerHTML = `
.title, .name, .message, .animated-text, .animated-message {
    position: relative;
    z-index: 20 !important;
    color: #fff !important;
    text-shadow: 0 0 10px #000, 0 0 30px #ff69b4, 0 0 2px #fff;
}
`;
document.head.appendChild(styleFix); 