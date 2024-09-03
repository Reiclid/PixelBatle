import db from '../server/database.js';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;

        // Додаємо гравця в базу даних
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Випадковий колір для гравця
        db.run('INSERT INTO players (username, color) VALUES (?, ?)', [username, color], function (err) {
            if (err) {
                console.error("Помилка реєстрації гравця:", err.message);
                return res.status(500).json({ message: 'Помилка реєстрації гравця' });
            }

            res.status(200).json({ message: 'Гравець успішно зареєстрований!', playerId: this.lastID, color });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
