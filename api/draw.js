import { Client } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { playerId, x, y, color } = req.body;

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            await client.query('INSERT INTO pixels (player_id, x, y, color) VALUES ($1, $2, $3, $4)', [playerId, x, y, color]);
            res.status(200).json({ message: 'Піксель успішно збережено!' });
        } catch (error) {
            console.error("Помилка збереження пікселя:", error.message);
            res.status(500).json({ message: 'Помилка збереження пікселя' });
        } finally {
            await client.end();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
