import fs,{ readFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import testInitialize from "../initialize.js";
import processPhrase from '../controller/processPhrase.js'

/* This build a test json file for the lesson object. */

async function testCreateLesson()
{
    await testInitialize();
    try {
        const data = await readFile(path.resolve('public/json/createLesson.json'), 'utf8');
        const lesson = JSON.parse(data);
        await fillPhraseData(lesson);

        const filePath = path.resolve('public/json/testData.json');
        await fs.writeFile(filePath, JSON.stringify(lesson,null,2), 'utf8')
        // await createLesson(lesson); 
    }
    catch (error) {
        console.log(`testCreateLesson: ${error}`);
    }

}

async function fillPhraseData(lesson)
{
    try {

        const base = lesson.basePhrases;
        const target = lesson.targetPhrases;
        const languages = lesson.languages;
        fillBaseData(base, languages[0]);
        fillTargetData(target, base, languages);
        for (let index = 0; index < base.length; index++){
            let basePhrase = base[index];
            let targetPhrase = target[index];
            await processPhrase(basePhrase, targetPhrase ); 
        }
       
        console.log("Base: " + JSON.stringify(base,null,2));
        console.log("Target: " + JSON.stringify(target,null,2))
      
    } catch (error) {
        console.log(`fillPhraseData: ${error}`)
    }
            
}

function fillBaseData(phrases, language)
{
    try {
        for (let phrase of phrases)
        {
            phrase.phraseid = uuidv4();
            phrase.language = {
                code: language.code,
                voice: language.voice,
                region:language.region
            }  
        }
    } catch (error) {
        console.log(`fillBaseData: ${error}`)
    }
    
    return phrases;
}

function fillTargetData(targetPhrases, basePhrases, languages) {
    
    try {
        let targetPhrase = {
            phraseid: '',
            phrase: '',
            language: {
                code: languages[1].code,
                voice: languages[1].voice,
                region: languages[1].region
            }
        };
    
        for(let phrase of basePhrases) 
        {
            let targetPhrase = {
                phraseid: '',
                phrase: '',
                language: {
                    code: languages[1].code,
                    voice: languages[1].voice,
                    region: languages[1].region
                }
            };
            targetPhrase.phraseid = phrase.phraseid;
            targetPhrases.push(targetPhrase);
        }

    } catch (error) {
        console.log(`fillTargetData: ${error}`)
    }

}

testCreateLesson();