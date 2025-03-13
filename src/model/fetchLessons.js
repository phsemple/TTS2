import { connection } from './connectDB.js'

export default async function fetchLesson()
{
    const sql = `SELECT * FROM Lessons order by lessonid;` 
    const [rows] = await connection.execute(sql);
    return rows;
}