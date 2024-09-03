const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
let playerId;
let playerColor;

// Реєстрація гравця
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const data = await response.json();
    alert(data.message);
    playerId = data.playerId;
    playerColor = data.color;

    loadPlayers(); // Оновлення списку гравців після реєстрації
});

// Малювання пікселів
canvas.addEventListener('click', async (event) => {
    if (!playerId) {
        alert('Спершу потрібно зареєструватися!');
        return;
    }

    const x = event.offsetX;
    const y = event.offsetY;

    drawPixel(x, y, playerColor);

    await fetch('/api/draw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ playerId, x, y, color: playerColor })
    });
});

// Функція для малювання пікселів
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 5, 5); // Малює квадратик 5x5 пікселів
}

// Завантаження списку гравців
async function loadPlayers() {
    const response = await fetch('/api/players');
    const players = await response.json();
    
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';

    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.username} (${player.color})`;
        listItem.style.color = player.color;
        playerList.appendChild(listItem);
    });
}

// Завантажуємо гравців при завантаженні сторінки
window.onload = loadPlayers;
