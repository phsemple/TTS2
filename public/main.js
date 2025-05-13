import path from 'path';
import { config } from "dotenv";
import { readFile } from 'fs/promises';
import connectDB from './src/model/connectDB.js';
import initializeEnviroment from './src/environment/initialize.js';
import createLesson from './src/controller/createLesson.js';
import getLessonById from './src/controller/getLessonById.js'
import getLessons from './src/controller/getLessons.js'
import removePhrases from './src/controller/removePhrases.js'
import updatePhrases from './src/controller/updatePhrases.js'


config();
initializeEnviroment(); 
await connectDB();

// create new lesson from our json file.
async function main()
{
    try {
        await createLesson(path.resolve('public/json/createLesson.json'));
    }
    catch (error) {
        console.log(`main: ${error}`);
    }

}
// main();

// get lesson
async function main2() {
    try {   
        initializeEnviroment();
        await connectDB();
        const result = await getLessonById(7)
        console.log(`Main2(): ${result}`);
    } catch (error) {
        console.log(`main: ${error}`);
    }
}
// main2();

// get lesson
async function lessons() {
    try {   
        initializeEnviroment();
        await connectDB();
        const result = await getLessons()
        console.log(`:Lessons(): ${result}`);
    } catch (error) {
        console.log(`Lesson: ${error}`);
    } 
} 

// lessons();


// make sure the values are out of the array in the final sql.
async function deleteRecs()
{
    initializeEnviroment();
    await connectDB();
    removePhrases(
        ['16e4506f-7bf8-4bb2-bd6b-5484c6ddc34b',
            '16e4506f-7bf8-4bb2-bd6b-5484c6ddc34b']); 
}

async function updateRecs()
{
   
   
}


async function testDeleteUpdate()
{
    initializeEnviroment();
    await connectDB();

    const filePath = path.resolve('src/model/dbSQL/Lesson7.json')
    const data = await readFile(filePath, 'utf8');  // Read file content
    const phrases = JSON.parse(data); 
    console.log(`===== Phrases Before: ${JSON.stringify(phrases, null, 2)}`);
    await updatePhrases(phrases);
    console.log(`===== Phrases after: ${JSON.stringify(phrases, null, 2)}`);
}

// testDeleteUpdate();




async function processPhrase(base, target){

    target.phrase = await translate(base.phrase, base.language.code, target.language.code);

    await textToSpeech(base, base.language.region, base.language.voice);
    await textToSpeech(target, target.language.region, target.language.voice);
    console.log(`Target Phrase: ${target.phrase}`);
}

   
// translate the text from base to target
export async function translate(text, baseLang, targetLang) {
    try {

        const translateURL = `${process.env.TRANSLATE_URL}?key=${process.env.API_KEY}`;

        // 1. Translate text using Translation API
        const translateResponse = await fetch(translateURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: baseLang, 
                target: targetLang,
            }),
        });

        const translateData = await translateResponse.json();
        if (!translateData.data || !translateData.data.translations) {
            throw new Error("Translation API failed to return results.");
        }
        
        const translation = translateData.data.translations[0].translatedText;
        return translation;

    } catch (error) {
        console.error("Error:", error.message);
    }
} 

export async function textToSpeech(phraseObject, region, voice)
{ 
    const apiToken = process.env.API_SPEECHGEN;
    const email = process.env.SPEECHGEN_EMAIL; 
    const apiUrl = process.env.SPEECHGEN_URL; 
    const audioFormat = 'mp3';  // good enough for now

    const data = { // this is passed to API for translation
        token: apiToken,  // signin code
        email: email,     // account email
        lang: region,
        voice: voice, 
        format: audioFormat, 
        speed: 1.0,         // Playback speed (0.1 to 2.0)
        pitch: 0,           // Voice pitch (-20 to 20)
        emotion: 'neutral', // Emotion ('good', 'evil', 'neutral')
        text: ''            // gets filled in below
    };

    data.text = phraseObject.phrase;

    try{  
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data),
        });

        const result = await response.json();  // get speechgen response

        if (result.status === 1 && result.file) {

            const audioUrl = result.file;
            const audioResponse = await fetch(audioUrl);

            // must use arrayBuffer here, not buffer (deprecated for audioResponse()). 
            // Then we need to convert it to buffer so mysql will store it.
            const audioBuffer = await audioResponse.arrayBuffer();
            phraseObject.audio = Buffer.from(audioBuffer); 
           
            // We will store the audio as buffer, but give it a file name
            phraseObject.audioId = `${phraseObject.phraseid}_${region}_${voice}.${audioFormat}`;

            return phraseObject;
        
        } else {
            console.error('Error:', result.error || 'Unknown error occurred.');
        }
 
      } catch (error) {
        console.error('Request failed:', error);
      }
}

translateMain();
   



