
import deletePhrases from '../model/deletePhrases.js'

export default async function removePhrases(phraseIds)
{
    const rows = await deletePhrases(phraseIds);
    const result = JSON.stringify(rows, null, 2);
    return result;
}