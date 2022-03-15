// Main Container
const container = document.querySelector('.etch-container');

// Buttons
const grayButton = document.querySelector('.monochrome');
const blackButton = document.querySelector('.black');
const coloredButton = document.querySelector('.colored');
const eraserButton = document.querySelector('.eraser');
const setCanvasSize = document.querySelector('.set-size');

// Background animation particles
const canvas = document.getElementById('canvas-main');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Get current mouse position
let mousePosition = {
    x: null,
    y: null,
    radius: (canvas.height/130) * (canvas.width/130)
};

window.addEventListener('mousemove', (e) => {
    mousePosition.x = e.x;
    mousePosition.y = e.y;
});

// Particles
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    };

    // Generate individual particle
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fillStyle = '#000001';
        context.fill();
    }

    // Checking particle and mouse position
    // Moving particle
    update() {
        // Checking whether the particle is still
        // within the canvas
        if (this.x > canvas.width || this.x < 0)
        {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0)
        {
            this.directionY = -this.directionY;
        }

        // Collision detection
        let dx = mousePosition.x - this.x;
        let dy = mousePosition.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mousePosition.radius + this.size)
        {
            if (mousePosition.x < this.x && this.x < canvas.width - this.size * 10)
            {
                this.x += 10;
            }
            if (mousePosition.x > this.x && this.x > this.size * 10)
            {
                this.x -= 10;
            }
            if (mousePosition.y < this.y && this.y < canvas.height - this.size * 10)
            {
                this.y += 10;
            }
            if (mousePosition.y > this.y && this.y > this.size * 10)
            {
                this.y -= 10;
            }
        }

        // Move particles
        this.x += this.directionX;
        this.y += this.directionY;
        
        // Call the function
        this.draw();
    }
};

function initialize() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles * 1; i++)
    {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
};

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++)
    {
        particlesArray[i].update();
    }
    
    connect();
}

// Draw Connections
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++)
    {
        for (let b = a; b < particlesArray.length; b++)
        {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7))
            {
                opacityValue = 1 - (distance / 20000);
                context.strokeStyle = 'rgba(50,50,50,' + opacityValue + ')';
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(particlesArray[a].x, particlesArray[a].y);
                context.lineTo(particlesArray[b].x, particlesArray[b].y);
                context.stroke();
            }
        }
    }
}

// Buttons Container
const buttonsContainer = document.querySelector('.buttons');

// [MANUAL] Generate Canvas Function
function generateCanvas(column, row) {
    let canvasResolution = column * row;
    for (let i = 0; i < canvasResolution; i++)
    {
        const pixel = document.createElement('div')
        pixel.classList.add('box');
        container.style.gridTemplateColumns = `repeat(${column}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${row}, 1fr)`;
        container.appendChild(pixel);
    }
    resetColor();
}

// Monochrome Button Function
function grayScale() {
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(function (box) {
        box.addEventListener('mouseover', function () {
            let RNum = Math.floor(Math.random() * 256);
            let grayRGB = `rgb(${RNum},${RNum},${RNum})`
            box.style.background = grayRGB;
        });
    });
}

// Black Button Function
function pureBlack() {
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(function (box) {
        box.addEventListener('mouseover', function () {
            box.style.background = 'black';
        });
    });
}

// Colored Button Function
function rgbScale() {
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(function (box) {
        box.addEventListener('mouseover', function () {
            let redHex = Math.floor(Math.random() * 256);
            let greenHex = Math.floor(Math.random() * 256);
            let blueHex = Math.floor(Math.random() * 256);
            const RGB = `rgb(${redHex},${greenHex},${blueHex})`;
            box.style.background = RGB;
            });
        });
}

// Eraser Button Function
function erase() {
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(function (box) {
        box.addEventListener('mouseover', function () {
            box.style.background = 'white';
        });
    });
}

// Resets the canvas color to white (not the box)
function resetColor() {
    const boxes = container.querySelectorAll('.box');
    boxes.forEach(box => box.style.background = 'white');
}

// Resets the canvas (Removes the whole canvas), 
// called with generateCanvas to avoid errors.
function resetCanvas() {
    const boxs = container.querySelectorAll('.box')
    boxs.forEach(box => {
        box.remove();
    })
}

// Manual Resize (through prompt)
function reSize() {
        let user = prompt('Enter grid resolution: ');
        if (user === null || user < 1) {
            resetCanvas();
            generateCanvas(16,16);
        } else { 
            resetCanvas();
            generateCanvas(user,user);
        }
}

// Slider Range JS
var slider = document.getElementById('myRange');
var output = document.getElementById('demo');
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
  resetCanvas();
  generateCanvas(this.value, this.value);
}

// Calling Manual Functions
initialize();
animate();
generateCanvas(12, 12);
