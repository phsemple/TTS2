import { connection } from './connectDB.js'

export default async function deletePhrases(phraseIds)
{
    // create a placeholder for each phrase in the array
    const placeholders = phraseIds.map(() => '?').join(',');
    const sql = `DELETE FROM phrases WHERE phraseid IN (${placeholders});`;
    const values = phraseIds;
    const [rows] = await connection.execute(sql,values);
    return rows;
}