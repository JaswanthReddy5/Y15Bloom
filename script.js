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

// Enhanced particles with dynamic color
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 6000;
const posArray = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 100;
    posArray[i+1] = (Math.random() - 0.5) * 100;
    posArray[i+2] = (Math.random() - 0.5) * 100;
    
    // Color - mix pink, gold, and white
    const colorChoice = Math.random();
    if(colorChoice < 0.33) {
        // Pink
        colors[i] = 1.0;
        colors[i+1] = 0.41;
        colors[i+2] = 0.7;
    } else if(colorChoice < 0.66) {
        // Gold
        colors[i] = 1.0;
        colors[i+1] = 0.84;
        colors[i+2] = 0.0;
    } else {
        // White with slight blue tint
        colors[i] = 0.9;
        colors[i+1] = 0.9;
        colors[i+2] = 1.0;
    }
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.008,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create 3D Cake using Three.js
function createCake() {
    const cakeScene = new THREE.Scene();
    const cakeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const cakeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const cakeContainer = document.getElementById('cake-3d');
    cakeRenderer.setSize(180, 180);
    cakeContainer.appendChild(cakeRenderer.domElement);
    cakeCamera.position.z = 6;

    // Cake base
    const baseGeometry = new THREE.CylinderGeometry(2.2, 2, 1.4, 64);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffb347,
        specular: 0xffffff,
        shininess: 100
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    cakeScene.add(base);

    // Middle layer
    const middleGeometry = new THREE.CylinderGeometry(1.8, 1.8, 1.2, 64);
    const middleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff69b4,
        specular: 0xffffff,
        shininess: 100
    });
    const middle = new THREE.Mesh(middleGeometry, middleMaterial);
    middle.position.y = 1.3;
    cakeScene.add(middle);

    // Top layer
    const topGeometry = new THREE.CylinderGeometry(1.4, 1.4, 1, 64);
    const topMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffb6c1,
        specular: 0xffffff,
        shininess: 100
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 2.4;
    cakeScene.add(top);

    // Icing details
    const baseIcingGeometry = new THREE.TorusGeometry(2.1, 0.15, 16, 100);
    const icingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const baseIcing = new THREE.Mesh(baseIcingGeometry, icingMaterial);
    baseIcing.position.y = 0.7;
    baseIcing.rotation.x = Math.PI / 2;
    cakeScene.add(baseIcing);

    const middleIcingGeometry = new THREE.TorusGeometry(1.8, 0.12, 16, 100);
    const middleIcing = new THREE.Mesh(middleIcingGeometry, icingMaterial);
    middleIcing.position.y = 1.9;
    middleIcing.rotation.x = Math.PI / 2;
    cakeScene.add(middleIcing);

    // Candles
    function createCandle(x, z, color) {
        const candleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 32);
        const candleMaterial = new THREE.MeshPhongMaterial({ color: color });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        candle.position.set(x, 2.9, z);
        cakeScene.add(candle);
        
        // Flame
        const flameGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const flameMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffff00,
            transparent: true,
            opacity: 0.9
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = 0.5;
        flame.userData = { originalY: 0.5 };
        candle.add(flame);
        
        return { candle, flame };
    }
    
    // Create multiple candles in a circle
    const candles = [];
    const candleColors = [0xff69b4, 0xffd700, 0x00e6e6, 0xff5e62];
    const radius = 0.8;
    const candle1 = createCandle(0, 0, 0xffffff); // Center candle
    candles.push(candle1);
    
    for(let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const candle = createCandle(x, z, candleColors[i % candleColors.length]);
        candles.push(candle);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    cakeScene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xfff2a1, 1, 100);
    pointLight.position.set(0, 5, 5);
    cakeScene.add(pointLight);
    
    // Additional lights for dynamic effect
    const blueLight = new THREE.PointLight(0x7afcff, 0.5, 20);
    blueLight.position.set(-5, 3, -5);
    cakeScene.add(blueLight);
    
    const pinkLight = new THREE.PointLight(0xff69b4, 0.5, 20);
    pinkLight.position.set(5, 0, -2);
    cakeScene.add(pinkLight);

    // Animate cake
    function animateCake() {
        requestAnimationFrame(animateCake);
        
        const time = Date.now() * 0.001;
        
        // Rotate cake slowly
        base.rotation.y += 0.01;
        middle.rotation.y += 0.01;
        top.rotation.y += 0.01;
        
        // Floating effect for cake
        const floatY = Math.sin(time * 0.8) * 0.1;
        base.position.y = floatY;
        middle.position.y = 1.3 + floatY;
        top.position.y = 2.4 + floatY;
        baseIcing.position.y = 0.7 + floatY;
        middleIcing.position.y = 1.9 + floatY;
        
        // Animate candle flames
        candles.forEach((candleObj, i) => {
            const { flame } = candleObj;
            // Flicker flame
            flame.scale.set(
                1 + Math.sin(time * 10 + i) * 0.2,
                1 + Math.cos(time * 8 + i * 2) * 0.3,
                1 + Math.sin(time * 6 + i * 4) * 0.2
            );
            
            // Make flames move slightly
            flame.position.y = flame.userData.originalY + Math.sin(time * 15 + i * 3) * 0.05;
        });
        
        // Dynamic lights
        blueLight.position.x = Math.sin(time * 0.5) * 5;
        blueLight.position.z = Math.cos(time * 0.5) * 5;
        pinkLight.position.x = Math.cos(time * 0.7) * 5;
        pinkLight.position.z = Math.sin(time * 0.7) * 5;
        
        cakeRenderer.render(cakeScene, cakeCamera);
    }
    
    animateCake();
}

// Animation loop for background particles
function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.x += 0.0003;
    particlesMesh.rotation.y += 0.0005;

    // Add wave effect to particles
    const time = Date.now() * 0.0005;
    for(let i = 0; i < particlesCount * 3; i += 3) {
        const x = particlesGeometry.attributes.position.array[i];
        const y = particlesGeometry.attributes.position.array[i+1];
        
        // Apply subtle wave effect
        particlesGeometry.attributes.position.array[i+2] += Math.sin(time + x * 0.1) * 0.01;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Create animated falling hearts
function createFallingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.color = getRandomColor();
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    heart.style.setProperty('--random-x', Math.random() * 2 - 1);
    heart.style.setProperty('--random-rotate', Math.random() * 3 - 1.5);
    
    document.getElementById('falling-hearts').appendChild(heart);
    
    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Generate random pastel color for hearts
function getRandomColor() {
    const colors = [
        '#ff69b4', // Pink
        '#ff1493', // Deep Pink
        '#ffc0cb', // Light Pink
        '#ffd700', // Gold
        '#ffb6c1', // Light Pink
        '#ff77ff', // Bright Pink
        '#ff69b4', // Hot Pink
        '#ff007f', // Rose
        '#ff66cc', // Pastel Pink
        '#ff007f'  // Bright Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Create sparkles effect
function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        sparkle.style.animationDuration = Math.random() * 1 + 1 + 's';
        sparklesContainer.appendChild(sparkle);
    }
}

// Create and animate confetti and balloons
function createConfetti() {
    // Using canvas-confetti library
    const confettiSettings = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    };
    
    confetti({
        ...confettiSettings,
        angle: 60,
        origin: { x: 0 }
    });
    confetti({
        ...confettiSettings,
        angle: 120,
        origin: { x: 1 }
    });
}

// Handle wish button click
document.getElementById('wishButton').addEventListener('click', function() {
    // Create burst of hearts
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFallingHeart();
        }, i * 100);
    }
    
    // Show birthday message
    document.getElementById('birthdayMessage').style.display = 'block';
    
    // Fire confetti
    createConfetti();
    
    // Play birthday song
    document.getElementById('birthdaySong').play();
});

// Toggle background music
document.getElementById('musicToggle').addEventListener('click', function() {
    const music = document.getElementById('backgroundMusic');
    if (music.paused) {
        music.play();
        this.textContent = '🔇 Mute Music';
    } else {
        music.pause();
        this.textContent = '🔊 Play Music';
    }
});

// Initialize everything once the page loads
window.addEventListener('load', function() {
    // Hide preloader
    document.getElementById('preloader').style.display = 'none';
    
    // Create and animate the 3D cake
    createCake();
    
    // Start background animation
    animate();
    
    // Create sparkles
    createSparkles();
    
    // Create initial falling hearts
    setInterval(createFallingHeart, 3000);
    
    // Initial confetti burst
    setTimeout(() => {
        createConfetti();
    }, 1000);
    
    // Handle window resize for responsive design
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});