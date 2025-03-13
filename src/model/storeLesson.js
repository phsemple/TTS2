import { v4 as uuidv4 } from 'uuid';
import { connection } from './connectDB.js'

/* 
    We are sent the lesson object sent from the controller for createLesson(). The storeLessonHeader()
    is called early, in order to get a lessonid that can be used in naming the href object. 

    storePhrases() stores the phrases and the meta-data for them, along with the mp3 blob and 
    href. 

*/


// Insert the header and send us back the lessonid 
// that was generated. 
export async function storeLessonHeader(lesson)
{
    try { 
        const sql = `INSERT INTO lessons (lessonname, category)
                        VALUES (?, ?)`
        const values = [
            lesson.lesson,
            lesson.category,
        ];
        const [row] = await connection.execute(sql,values);

        lesson.lessonid = row.insertId;

        return (row.insertId);
        
    }
    catch (error) {
        console.log(`storeLessonHeader: ${error}`); 
    }
}

// insert the phrases for the lesson.
// the phrases are in pairs: a base and a target record. 
// the base is given a uuid, the companion target is
// given the same id. We put in an orderby field so
// the records can be displayed interleaved. B 1, T 1, B 2, T 2 , etc
export async function storePhrases(lesson) {
    
    const base = lesson.languages[0];
    const args = {
        lessonid: lesson.lessonid,
        langcode: base.code,
        voice   : base.voice,
        region  : base.region,
    }
    
    const phrases = lesson.basePhrases;
    for (let index = 0; index < phrases.length; index++)
    {
        args.phrase = phrases[index].phrase;
        args.phraseid = phrases[index].phraseid;
        args.audioId = phrases[index].audioId;
        args.audio = Buffer.from(phrases[index].audio);
        await storePhrase(args);      // 
        await storeTarget(lesson, index, args.phraseid);  // we want the matching target phrase to have the same uuid
        await storeCrossReference(lesson.lessonid,  args.phraseid, index+1); // lesson/phrases m:n reference table;
    } 
}

async function storeCrossReference(lessonid, phraseId, phraseOrder) {
    const sql = `INSERT INTO lesson_phrases ( lessonid,phraseid,phraseorder)
           VALUES( ?,?,?)`
             
    const values = [
        lessonid,
        phraseId,
        phraseOrder
    ]

    const [row] = await connection.execute(sql, values);
    return (row.insertId);
}

async function  storeTarget(lesson, index, uuid)
{
    const target = lesson.languages[1];
    const args = {
        langcode: target.code,
        voice: target.voice,
        region: target.region,
    }
    
    const phrases = lesson.targetPhrases;
    args.phraseid = uuid;
    args.phrase = phrases[index].phrase;
    args.audioId = phrases[index].audioId;
    args.audio = Buffer.from(phrases[index].audio);
    await storePhrase(args);

}

async function storePhrase(args)
{
    const sql = `INSERT INTO phrases ( phraseid,langcode, phrase,region, voice, audioname, audio)
           VALUES( ?,?,?,?,?,?,?)`
             
    const values = [
        args.phraseid,
        args.langcode,
        args.phrase, 
        args.region,
        args.voice,
        args.audioId,
        args.audio
     ]

    const [row] = await connection.execute(sql, values);
    return (row.insertId);
}