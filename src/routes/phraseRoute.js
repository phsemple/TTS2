import express from 'express';
import { Router } from 'express';
import path from 'path'

import {processTranslate, processAudio} from '../controller/processPhrase.js'
import getAudio from '../controller/getAudio.js'

const router = Router(); // to create a router

export default router;

// We are passed in a phrase object to be translated and converted to speech.
router.post("/", async (req, res) => {

    try {

        const { base, target } = req.body; 
        
        if (!base || !target ) {
            return res.status(400).send("Missing required fields.");
        }
        await processTranslate( base, target );
        res.json({ 
            base, 
            target 
        });


    } catch (error) {
        console.log(`processTranslate router.post("/"): Error ${error}`)
    }
});

router.post("/audio/base", async (req, res) => {

    try {

        const { base } = req.body; 
        
        if (!base ) {
            return res.status(400).send("Missing required fields.");
        }
        const audioBase = await processAudio( base );
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioBase);

    } catch (error) {
        console.log(`processAudio router.post("/audio/base"): Error ${error}`)
    }
});

router.post("/audio/target", async (req, res) => {

    try {
        const { target } = req.body; 
        if (!target ) {
            return res.status(400).send("Missing required fields.");
        }
        console.log(`In target start`);
        const audioTarget = await processAudio( target );
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioTarget);
    } catch (error) {
        console.log(`processAudio router.post("/audio/target"): Error ${error}`)
    }
});



// Get the audio file
router.get("/:someKey", async (req, res) => {
    const audioId = req.params.someKey;
    console.log(audioId);
    const audio = await getAudio(audioId);
     res.setHeader("Content-Type", 'audio/mpeg');
     res.setHeader("Content-Disposition", `inline; filename="${audioId}"`);
     res.setHeader("Cache-Control", "no-cache");
     res.setHeader("Accept-Ranges", "bytes");

    // ✅ Send the binary audio data
    res.send(audio[0].audio);
});