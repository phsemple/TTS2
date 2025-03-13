import express from 'express';
import { Router } from 'express';
import path from 'path'

import processPhrase from '../controller/createLesson.js'

const router = Router(); // to create a router

export default router;

router.post("/", async (req, res) => {
    console.log("Form Data Received:", req.body); // Logs form data

    try {
            // Read file content Temporarily
            const data = await readFile(path.resolve('public/json/createLesson.json'), 'utf8');
            const lesson = JSON.parse(data);
             await createLesson(lesson);                                
             res.send(`✅ Form Submitted!`);
    } catch (error) {
            console.error('createLesson: Error reading JSON file:', error);
    }
});

router.get("/:someFile", async (req, res) => {
    const audioId = req.params.someFile;
    console.log(audioId);
    const audio = await getAudio(audioId);
     res.setHeader("Content-Type", 'audio/mpeg');
     res.setHeader("Content-Disposition", `inline; filename="${audioId}"`);
     res.setHeader("Cache-Control", "no-cache");
     res.setHeader("Accept-Ranges", "bytes");

    // ✅ Send the binary audio data
    res.send(audio[0].audio);
});