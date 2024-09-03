import db from '../server/database.js';

export default function handler(req, res) {
    if (req.method === 'GET') {
        db.all('SELECT * FROM players', (err, rows) => {
            if (err) {
                console.error("Помилка отримання гравців:", err.message);
                return res.status(500).json({ message: 'Помилка отримання гравців' });
            }

            res.status(200).json(rows);
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
