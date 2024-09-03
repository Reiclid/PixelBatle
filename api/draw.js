import db from '../server/database.js';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { playerId, x, y, color } = req.body;

        db.run('INSERT INTO pixels (player_id, x, y, color) VALUES (?, ?, ?, ?)', [playerId, x, y, color], (err) => {
            if (err) {
                console.error("Помилка збереження пікселя:", err.message);
                return res.status(500).json({ message: 'Помилка збереження пікселя' });
            }

            res.status(200).json({ message: 'Піксель успішно збережено!' });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
