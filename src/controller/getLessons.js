import fetchLesson from '../model/fetchLessons.js'

export default async function getLessons()
{
    const rows = await fetchLesson();
    const result = JSON.stringify(rows, null, 2);
    return result;
}