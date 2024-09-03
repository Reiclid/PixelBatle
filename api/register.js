import { Client } from '@vercel/postgres';

export default async function handler(req, res) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL, // Використовуй змінну середовища
        ssl: {
            rejectUnauthorized: false
        }
    });

    await client.connect();

    if (req.method === 'POST') {
        const { username } = req.body;
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

        try {
            const result = await client.query('INSERT INTO players (username, color) VALUES ($1, $2) RETURNING *', [username, color]);
            res.status(200).json({ message: 'Гравець успішно зареєстрований!', player: result.rows[0] });
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
