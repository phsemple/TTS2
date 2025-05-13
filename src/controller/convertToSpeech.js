import { config } from "dotenv";
import path from 'path';
import fs from 'fs/promises'
import { spawn } from 'child_process' // allows us to use ffmpeg and ffprobe

config(); // Load .env variables

const imagePath = '/Users/harley/Development/TTS2/public/audio';

export default async function convertToSpeech(lesson)
{
  //             language descr        array of phrases
  await runTextToSpeech(lesson.languages[0], lesson.basePhrases, lesson.lessonid);
  await runTextToSpeech(lesson.languages[1], lesson.targetPhrases, lesson.lessonid);
}
 
export async function runTextToSpeech(language, phrases, lessonid)
{ 
      const apiToken = process.env.API_SPEECHGEN;
      const email = process.env.SPEECHGEN_EMAIL; 
      const apiUrl = process.env.SPEECHGEN_URL; 
  
      const data = { // this is passed to API for translation
      token: apiToken,  // signin code
      email: email,     // account email
      lang: language.region,
      voice: language.voice, 
      format: 'mp3', // Desired audio format
      speed: 1.0,    // Playback speed (0.1 to 2.0)
      pitch: 0,      // Voice pitch (-20 to 20)
      emotion: 'neutral', // Emotion ('good', 'evil', 'neutral')
      text: ''  // gets filled in below
    };

    let filenum = 0;  // this becomes part of the file name
    for (let phrase of phrases) {
      try {

        if (phrase === '') continue;  // we have a blank line

        // editing process may cause a string to be past instead of
        // a phrase object. {"phrase":phrase}. We need an objecyt
        if (Object.prototype.toString.call(phrase) !== '[object Object]') {
          phrase = { "phrase": phrase };
        }

        data.text = phrase.phrase;  
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data),
        });
        const result = await response.json();  // get speechgen response

        if (result.status === 1 && result.file) {

          const audioUrl = result.file;
          const audioResponse = await fetch(audioUrl);

          // must use arrayBuffer here, not buffer (deprecated). Then we 
          // need to convert it to buffer so mysql will store it.
          const audioBuffer = await audioResponse.arrayBuffer(); 
          // const buffer = Buffer.from(audioBuffer); 

          // We will store the audio as buffer, but give it a file name
          filenum++;
          let outFile = `${lessonid}_${filenum}_${language.region}_${language.voice}.mp3`;
          // await fs.writeFile(outFile, buffer);
          console.log(`Audio named as ${outFile}`);
          
          // add the buffer and buffer name to the phrase object.
          phrase.mp3File = outFile;
          phrase.audio = audioBuffer;

        } else {
          console.error('Error:', result.error || 'Unknown error occurred.');
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
  }

 