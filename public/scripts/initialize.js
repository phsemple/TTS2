import getPhrase from './getPhrase.js'
import LanguageList from './LanguageList.js'
import playAudio from './playAudio.js'
import insertPhrases from './insertPhrases.js'

export const getLanguageList = new LanguageList();

// FORM
const translateForm = document.querySelector('.language-form')
translateForm.addEventListener('submit', async (e) => {

    // If the translate button was the submit source we want to block default.
    if (e.submitter && e.submitter.classList.contains('translate-button')) {
        e.preventDefault();
        const translateButton = document.querySelector('.translate-button');
        translateButton.disabled = true;
        const phraseItems = await getPhrase(translateForm);
        insertPhrases(phraseItems);
        translateButton.disabled = false;
    }
});

// PHRASE AUDIO 
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("phrase")) {  
        const phraseId = e.target.id;  // ✅ Get the `id` of the clicked button
        playAudio(phraseId);
    }
});


