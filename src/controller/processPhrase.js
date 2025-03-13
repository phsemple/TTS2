import { v4 as uuidv4 } from 'uuid'; 

/*  
    This was split to process the translate separate from the speech conversion. Back in
    the route we get the the translate as json and the speech as a blob.

    This does not store the phrases, it returns the base and target objects filled in with
    the translation and the speech to text mp3 buffer. The router can then send the filled
    in objects back to the view.
*/
export  async function processTranslate(base, target){

    try {
        if (!base.phraseid) { // set phraseid
            base.phraseid = uuidv4();
            target.phraseid = base.phraseid;
        }
        
        // base has the phrase to be translated to the target language.
        target.phrase = await translate(base.phrase, base.language.code, target.language.code);
        console.log(`Translate Returns: ${target.phrase}`);
 
    } catch (error) {
        console.log(`ProcessPhrase: Error: ${error}`)
    }

}

/*  
    This does not store the phrases, it returns the base and target objects filled in with
    the translation and the speech to text mp3 buffer. The router can then send the filled
    in objects back to the view.
*/
export  async function processAudio(phraseObj){

    try{
        // we convert both phrases to speech.
        return await textToSpeech(phraseObj, phraseObj.language.region, phraseObj.language.voice);
    } catch (error) {
        console.log(`ProcessPhrase: Error: ${error}`)
    }

}

   
// translate the text from base to target
 async function translate(text, baseLang, targetLang) {
    try {

        console.log(`Translate: ${text}--${baseLang}--${targetLang}`)
        const translateURL = `${process.env.TRANSLATE_URL}?key=${process.env.API_KEY}`;

        // 1. Translate text using Translation API
        const translateResponse = await fetch(translateURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: text,
                source: baseLang, 
                target: targetLang,
            }),
        });

        console.log("Response Status:", translateResponse.status);
        console.log("Response Headers:", translateResponse.headers);
   
        const translateData = await translateResponse.json();
        if (!translateData.data || !translateData.data.translations) {
            throw new Error("Translation API failed to return results.");
        }
        
        const translation = translateData.data.translations[0].translatedText;
        return translation;

    } catch (error) {
        console.error("Error from", error.message);
    }
   
} 

 async function textToSpeech(phraseObject, region, voice)
{ 
    const apiToken = process.env.API_SPEECHGEN;
    const email = process.env.SPEECHGEN_EMAIL; 
    const apiUrl = process.env.SPEECHGEN_URL; 
    const audioFormat = 'mp3';  // good enough for now

    const data = { // this is passed to API for translation
        token: apiToken,  // signin code
        email: email,     // account email
        lang: region,
        voice: voice, 
        format: audioFormat, 
        speed: 1.0,         // Playback speed (0.1 to 2.0)
        pitch: 0,           // Voice pitch (-20 to 20)
        emotion: 'neutral', // Emotion ('good', 'evil', 'neutral')
        text: ''            // gets filled in below
    };

    data.text = phraseObject.phrase;

    try{  
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data),
        });

        const result = await response.json();  // get speechgen response

        if (result.status === 1 && result.file) {

            const audioUrl = result.file;
            const audioResponse = await fetch(audioUrl);

            // must use arrayBuffer here, not buffer (deprecated for audioResponse()). 
            // Then we need to convert it to buffer so mysql will store it.
            const audioBuffer = await audioResponse.arrayBuffer();
            const audio = Buffer.from(audioBuffer); 
           
            return audio;
        
        } else {
            console.error('Error:', result.error || 'Unknown error occurred.');
        }
 
      } catch (error) {
        console.error('Request failed:', error);
      }
}
    