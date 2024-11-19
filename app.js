const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
    host: 'your-host',
    user: 'your-username',
    password: 'your-password',
    database: 'web_app'
});

app.post('/submit', async (req, res) => {
    const { datum, status, vrsta, vrijeme, dogovara, iznos, napomena } = req.body;
    try {
        await connection.execute(`
            INSERT INTO records (datum, status, vrsta, vrijeme, dogovara, iznos, napomena)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [datum, status, vrsta, vrijeme, dogovara, iznos, napomena]);
        res.send("Podaci su uspješno uneseni.");
    } catch (err) {
        res.status(500).send("Greška prilikom unosa.");
    }
});

app.get('/report', async (req, res) => {
    try {
        const [rows] = await connection.execute(`
            SELECT vrsta, SUM(iznos) as total
            FROM records
            GROUP BY vrsta
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).send("Greška prilikom dohvaćanja podataka.");
    }
});
