import { storeLessonHeader, storePhrases } from '../model/storeLesson.js';

export default async function createLesson(lesson)
{
     try {
        await storeLessonHeader(lesson);
        await storePhrases(lesson);                               
    } catch (error) {
        console.error('createLesson: Error:', error);
    }
}

