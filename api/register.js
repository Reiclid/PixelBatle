import { Client } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username } = req.body;
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Випадковий колір для гравця

        const client = new Client({
            connectionString: process.env.DATABASE_URL, // Використовуй змінну середовища
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            const result = await client.query('INSERT INTO players (username, color) VALUES ($1, $2) RETURNING *', [username, color]);
            res.status(200).json({ message: 'Гравець успішно зареєстрований!', playerId: result.rows[0].id, color });
        } catch (error) {
            console.error("Помилка реєстрації гравця:", error.message);
            res.status(500).json({ message: 'Помилка реєстрації гравця' });
        } finally {
            await client.end();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
