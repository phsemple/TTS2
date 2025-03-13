import {getLanguageList} from './initialize.js';
import LanguageItem from './LanguageItem.js';

export default async function playAudio(audioKey)
{   
    const item = getLanguageList.getItem(audioKey);
    const audioElement = document.getElementById("audio-player");
    audioElement.src = await item.getAudio();
    await audioElement.play().catch(error => console.error("Playback error:", error))
}

    