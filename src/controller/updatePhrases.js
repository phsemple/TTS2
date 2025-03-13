import { translateText } from './translate.js';
import { runTextToSpeech } from './convertToSpeech.js';

export default async function updatePhrases(phrases)
{
    // EDIT BASE PHRASE: if they edited the phrase in the base language we
    // retranslate to the target and generate a new speech file.

    // EDIT TARGET PHRASE: If the edited the target phrase, we assume they are
    // correcting the translation and do not run any translation.
    // We do generate a speech file for it.

    // IF we start using multiple languages then all the targets for this base
    // phraseid will need to be retranslated.

    // This makes a new array with updated records. 
    const updatedRecs = phrases.filter(obj => obj.update === 'true');

    // We get the original record.
    for (const copyPhrase of updatedRecs) {
        const original = findOriginal(phrases, copyPhrase)
        await updateFields(phrases, original);  // update the original record.
    }
}

function isBasePhrase(phrase) {
    return phrase.base === phrase.langcode ? true : false;
}

async function updateFields(phrases, recPhrase)
{
    try {
        if (isBasePhrase(recPhrase)) {
            
            // this is the base phrase, so we need to grab the companion target.
            const targetRec = phrases.filter(obj => {
                return obj.phraseid === recPhrase.phraseid && obj.langcode !== recPhrase.langcode;
            });
            const originalTarget = findOriginal(phrases, targetRec[0]);

            // for base we need to translate to the target and create speech for the target.
            originalTarget.phrase = await translateText(recPhrase.phrase, recPhrase.langcode, originalTarget.langcode);
            const language = {
                region: originalTarget.region,
                voice: originalTarget.voice
            };
            await runTextToSpeech(language, [originalTarget.phrase], originalTarget.lessonid);

        }
    
        // Create a speech for the recPhrase. This will be either a base or target.
        const language = {
            region: recPhrase.region,
            voice: recPhrase.voice
        };
        await runTextToSpeech(language, [recPhrase.phrase], recPhrase.lessonid);

    } catch (error) {
            console.log(`UpdateFields(): ${error}`);
    }

}

function findOriginal(phrases,copyPhrase)
{
    try {
        const index = phrases.findIndex((rec) => {
            return rec.phraseid === copyPhrase.phraseid &&
                rec.langcode === copyPhrase.langcode
        });
        if (index === -1) throw new Error("Record not found: findIndex returned -1"); 
        return phrases[index];
    } catch (error) {
        console.log(`findOriginal(): ${error} : ${copyPhrase}`)
    }
}


