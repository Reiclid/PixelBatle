import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';

export default function handler(req, res) {
    console.log("Отримано запит");
    
    if (req.method === 'POST') {
        const { username, password } = req.body;
        console.log(`Отримано дані: ${username}, ${password}`);
        
        // Підключення до бази даних
        const db = new sqlite3.Database('./server/users.db', (err) => {
            if (err) {
                console.error("Помилка підключення до бази даних:", err.message);
                return res.status(500).json({ message: 'Помилка підключення до бази даних' });
            }
        });

        // Хешування пароля
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("Помилка хешування пароля:", err.message);
                return res.status(500).json({ message: 'Помилка хешування пароля' });
            }

            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
                if (err) {
                    console.error("Помилка збереження користувача:", err.message);
                    return res.status(500).json({ message: 'Помилка збереження користувача' });
                }

                console.log("Користувач успішно зареєстрований");
                res.status(200).json({ message: 'Користувач успішно зареєстрований!' });
            });

            db.close();
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

