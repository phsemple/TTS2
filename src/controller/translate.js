import fetch from "node-fetch";
import { config } from "dotenv";

config(); // Load .env variables

// translate the base language to the target language
export default async function translate(lesson)
{
    try {
        const basePhrases = lesson.basePhrases;

        const base = lesson.languages[0];
        const baseLang = base.langcode;
        const targetLang = lesson.languages[1].langcode;
    
        // create array of promises and await them to resolve.
        const translationPromises = basePhrases.map((base) => translateText(base.phrase, baseLang, targetLang));
        lesson.targetPhrases = await Promise.all(translationPromises);

    } catch (error) {
        console.error(`Translate: Error: ${ error.message }`)
    };
}

    
// translate the text from base to target
export async function translateText(text, base, target) {
    try {

        const translateURL = `${process.env.TRANSLATE_URL}?key=${process.env.API_KEY}`;

        // 1. Translate text using Translation API
        const translateResponse = await fetch(translateURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: base, 
                target: target,
            }),
        });

        const translateData = await translateResponse.json();
        if (!translateData.data || !translateData.data.translations) {
            throw new Error("Translation API failed to return results.");
        }
        
        const phraseObj = {phrase:translateData.data.translations[0].translatedText }
        return phraseObj;

    } catch (error) {
        console.error("Error:", error.message);
    }
} 
    