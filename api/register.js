import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        
        // Підключення до бази даних
        const db = new sqlite3.Database('./server/users.db');

        // Хешування пароля
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Помилка хешування пароля' });

            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
                if (err) return res.status(500).json({ message: 'Помилка збереження користувача' });

                res.status(200).json({ message: 'Користувач успішно зареєстрований!' });
            });
        });

        db.close();
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
