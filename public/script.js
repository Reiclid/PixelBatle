const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
const socket = new WebSocket('ws://localhost:3000');

canvas.addEventListener('click', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const color = '#000'; // Чорний колір для малювання

    // Малюємо на клієнті
    drawPixel(x, y, color);

    // Відправляємо дані на сервер
    socket.send(JSON.stringify({ x, y, color }));
});

socket.onmessage = (event) => {
    const { x, y, color } = JSON.parse(event.data);
    drawPixel(x, y, color);
};

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 5, 5); // Малює квадратик 5x5 пікселів
}

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
});
