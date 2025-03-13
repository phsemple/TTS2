import LanguageItem from './LanguageItem.js'
export default class LanguageList {
    constructor()
    {
        this.listArray = [];
    }

    async addItem(item) {
        const langItem = new LanguageItem(item, this.listArray.length);
        langItem.initialize();
        this.listArray.push(langItem);
        return langItem;
    }

    getItem(key) {
        return this.listArray[key];
    }

}