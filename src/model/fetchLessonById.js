import { connection } from './connectDB.js'

export default async function fetchLessonById(lessonId)
{
    const sql = `SELECT * FROM LessonById 
            WHERE lessonid = ? ORDER BY orderby;`
    const values = [lessonId];
    const [rows] = await connection.execute(sql, values);
    return rows;
}

