
import {getLanguageList} from './initialize.js'

export default async function getPhrase(form) {

    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

      const base = {
        phraseid: '',
        phrase: formObject.phrase,
        language: {
            code: formObject.baselanguage,
            voice: formObject.baseVoice,
            region: formObject.baseRegion,
        }
    }

    const target = {
        phraseid: '',
        phrase: '',
        language: {
            code: formObject.language,
            voice: formObject.voice,
            region: formObject.region,
        }
    }

    try {

        // get the translations back in json
        let data = await fetch('/phrase', {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({ base, target }) 
        }).then((response) => {return response.json()
        }).then((data) => {return data;
        }).catch((reason) => { console.log(`getPhrase.translate: Fetch Failed ${reason}`) });
        
        // the /phrase process adds values to both target and base. We assign them back
        // to their origin objects.
        Object.assign(base, data.base);
        Object.assign(target, data.target);

        // we get the audio blob back
        const audioBase = await fetch('/phrase/audio/base', {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({ base }) 
        }).then((response) => {return response.blob()
        }).catch((reason) => { console.log(`getPhrase.Audio/base: Fetch Failed ${reason}`) });
        base.audio = audioBase; // attach the audio

        // we get the audio blob back
        const audioTarget = await fetch('/phrase/audio/target', {
            method: 'POST',  
            headers: {
            'Content-Type':'application/json', 
            },
            body: JSON.stringify({ target }) 
        }).then((response) => {return response.blob()
        }).catch((reason) => { console.log(`getPhrase.Audio/target: Fetch Failed ${reason}`) });
        target.audio = audioTarget; // attach the audio

        const baseItem =  await getLanguageList.addItem(base);
        const targetItem = await getLanguageList.addItem(target);

        return { baseItem, targetItem };

    } catch (error) {
        console.log(`Error in Routing Phrase: ${error}`)
    }

    
}


