import fetchLesson from '../model/fetchLessonById.js'

export default async function getLessonById(lessonId)
{
    const rows = await fetchLesson(lessonId);
    const result = JSON.stringify(rows, null, 2);
    return result;
}