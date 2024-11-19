const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./data.db');

db.run(`
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        datum TEXT,
        status TEXT,
        vrsta TEXT,
        vrijeme TEXT,
        dogovara TEXT,
        iznos REAL,
        napomena TEXT
    )
`);

app.post('/submit', (req, res) => {
    const { datum, status, vrsta, vrijeme, dogovara, iznos, napomena } = req.body;
    db.run(`
        INSERT INTO records (datum, status, vrsta, vrijeme, dogovara, iznos, napomena)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [datum, status, vrsta, vrijeme, dogovara, iznos, napomena],
        function(err) {
            if (err) {
                return res.status(500).send("Greška prilikom unosa.");
            }
            res.send("Podaci su uspješno uneseni.");
        });
});

app.get('/report', (req, res) => {
    db.all(`
        SELECT vrsta, SUM(iznos) as total
        FROM records
        GROUP BY vrsta
    `, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Greška prilikom dohvaćanja podataka.");
        }
        res.json(rows);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});
