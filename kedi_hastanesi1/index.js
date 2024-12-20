const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '12345',
    port: 5432,
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// List all patients
app.get('/hastalar', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Hasta');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).send('An error occurred while fetching patients.');
    }
});

// Search patients
app.get('/hastalar/arama', async (req, res) => {
    try {
        const { isim, tur } = req.query;
        let query = 'SELECT * FROM Hasta WHERE 1=1';
        const params = [];

        if (isim) {
            query += ' AND isim ILIKE $1';
            params.push(`%${isim}%`);
        }

        if (tur) {
            query += ' AND tur ILIKE $2';
            params.push(`%${tur}%`);
        }

        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error searching patients:', error);
        res.status(500).send('An error occurred while searching for patients.');
    }
});

// Add a new patient
app.post('/hastalar', async (req, res) => {
    try {
        const { isim, tur, yas, cinsiyet, saglikDurumu, sahipBilgileri } = req.body;

        if (!isim || !yas || !cinsiyet) {
            return res.status(400).send('Name, age, and gender are required.');
        }

        const result = await pool.query(
            'INSERT INTO Hasta (isim, tur, yas, cinsiyet, saglikdurumu, sahipbilgileri) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [isim, tur, yas, cinsiyet, saglikDurumu, sahipBilgileri]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).send('An error occurred while adding the patient.');
    }
});

// Update a patient
app.put('/hastalar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isim, tur, yas, cinsiyet, saglikDurumu, sahipBilgileri } = req.body;

        const result = await pool.query(
            'UPDATE Hasta SET isim = $1, tur = $2, yas = $3, cinsiyet = $4, saglikdurumu = $5, sahipbilgileri = $6 WHERE hastaid = $7 RETURNING *',
            [isim, tur, yas, cinsiyet, saglikDurumu, sahipBilgileri, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).send('An error occurred while updating the patient.');
    }
});

// Delete a patient
app.delete('/hastalar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Hasta WHERE hastaid = $1', [id]);
        res.status(200).json({ message: 'Patient successfully deleted.' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).send('An error occurred while deleting the patient.');
    }
});

// Veritabanı bağlantısını test etmek
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err.stack);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı. Sunucu zamanı:', res.rows[0].now);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
