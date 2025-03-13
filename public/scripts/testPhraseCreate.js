
import { v4 as uuidv4 } from 'uuid';
import processPhrase from '../../src/controller/processPhrase.js'
import initialize from "./initialize.js";

async function translatePhrase()
{
    await initialize();

    const phraseid = uuidv4(); // same for target and base

    const base = {
        phraseid: phraseid,
        phrase: 'I want a cookie',
        language: {
            code: 'en',
            voice: 'Scott',
            region: 'en-US',
        }
    }

    const target = {
        phraseid: phraseid,
        phrase: '',
        language: {
            code: 'sw',
            voice: 'Rehema',
            region: 'sw-TZ',
        }
    }
    console.log(base);
    console.log(target);
    await processPhrase(base, target);
    console.log(`Target Phrase: ${target.phrase}`);
}

translatePhrase();
