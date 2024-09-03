import { Client } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            const result = await client.query('SELECT * FROM players');
            res.status(200).json(result.rows);
        } catch (error) {
            console.error("Помилка отримання гравців:", error.message);
            res.status(500).json({ message: 'Помилка отримання гравців' });
        } finally {
            await client.end();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
