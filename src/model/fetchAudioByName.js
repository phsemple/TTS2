import { connection } from './connectDB.js'

export default async function fetchAudioByName(name)
{
    const sql = `SELECT audio FROM phrases 
            WHERE audioname = ?;`
    const values = [name];
    const [rows] = await connection.execute(sql, values);
    return rows;
}
