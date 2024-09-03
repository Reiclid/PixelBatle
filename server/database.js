const sqlite3 = require('sqlite3').verbose();

// Підключення до бази даних
const db = new sqlite3.Database('./server/pixelbattle.db', (err) => {
    if (err) {
        console.error('Помилка підключення до бази даних:', err.message);
    } else {
        console.log('Підключення до бази даних успішне.');

        // Створення таблиці гравців
        db.run(`
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                color TEXT
            )
        `);

        // Створення таблиці пікселів
        db.run(`
            CREATE TABLE IF NOT EXISTS pixels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_id INTEGER,
                x INTEGER,
                y INTEGER,
                color TEXT,
                FOREIGN KEY(player_id) REFERENCES players(id)
            )
        `);
    }
});

module.exports = db;
