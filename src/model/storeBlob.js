CREATE TABLE lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phrase TEXT NOT NULL,
    audio BLOB NOT NULL,  -- Stores the raw binary audio data
    mime_type VARCHAR(50) NOT NULL  -- Stores the MIME type (e.g., audio/mpeg)
);


import mysql from 'mysql2/promise';
import fs from 'fs/promises';

async function storeAudio(phrase, filePath, mimeType) {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'yourpassword', database: 'languages' });

    // Read audio file as a buffer
    const audioBuffer = await fs.readFile(filePath);

    // Insert into MySQL
    const sql = `INSERT INTO lessons (phrase, audio, mime_type) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(sql, [phrase, audioBuffer, mimeType]);

    console.log(`Inserted lesson ID: ${result.insertId}`);
    await connection.end();
}

// Example Usage
await storeAudio('Hello, how are you?', 'hello.mp3', 'audio/mpeg');

** retrieving audio as Blob

import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

async function getLessons() {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'yourpassword', database: 'languages' });

    const [rows] = await connection.execute(`SELECT id, phrase, audio, mime_type FROM lessons`);

    // Convert audio BLOB to Base64
    const lessons = rows.map(row => ({
        id: row.id,
        phrase: row.phrase,
        audio: `data:${row.mime_type};base64,${row.audio.toString('base64')}`  // Convert BLOB to Base64 URI
    }));

    await connection.end();
    return lessons;
}

app.get('/lessons', async (req, res) => {
    try {
        const lessons = await getLessons();
        res.setHeader('Content-Type', 'application/json');
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

*** clientInformation

[
    {
        "id": 1,
        "phrase": "Hello, how are you?",
        "audio": "data:audio/mpeg;base64,//UklGRi..."
    }
]

async function fetchLessons() {
    const response = await fetch('/lessons');
    const lessons = await response.json();

    lessons.forEach(lesson => {
        console.log("Phrase:", lesson.phrase);

        // Create an audio element
        const audio = new Audio(lesson.audio);
        document.body.appendChild(audio);
        audio.controls = true;
    });
}

fetchLessons();


** // alternative
    
// We send over the text info when they request the lesson. we build the
    // element with the src and send the src when they request it.

app.get('/audio/:id', async (req, res) => {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', password: 'yourpassword', database: 'languages' });

    const [rows] = await connection.execute(`SELECT audio, mime_type FROM lessons WHERE id = ?`, [req.params.id]);

    if (rows.length === 0) return res.status(404).send('Audio not found');

    res.setHeader('Content-Type', rows[0].mime_type);
    res.send(rows[0].audio); // Send raw binary audio
});


