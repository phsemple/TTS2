

export default class LanguageItem {

    constructor(item,key)
    {
        this.item = item;
        this.item.key = key;
        this.item.URL = {};
    }

    async initialize() {
        this.item.URL = await this.convert(this.item.audio);
    }

     // convert the audio in the languageItem
    async convert(audio) {
        const audioUrl =   URL.createObjectURL(audio); 
        const audioPlayer = document.getElementById("audio-player");
        return audioUrl;
    }

    getKey() { return this.item.key; }
    getPhrase() {return this.item.phrase}
    getAudio() { return this.item.URL; }
}


        