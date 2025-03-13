import fetchAudioByName from '../model/fetchAudioByName.js';

export default async function getAudio(audioName) {
    
    try {
        console.log(`getAudio: ${audioName}`)
        const audio = await fetchAudioByName(audioName);
        return audio;
    } catch (error) {
        console.log(`getAudio: ${error}`);
    }
}