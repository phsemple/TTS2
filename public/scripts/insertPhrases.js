import LanguageItem from './LanguageItem.js';

export default function insertPhrases(phraseItems) {

    const listElement = document.querySelector('.phrase-list');
    const base = phraseItems.baseItem;
    const target = phraseItems.targetItem;

    // ✅ Create elements dynamically:
    // This method prevents security risks like XSS when inserting user-generated content.
    const listItem = document.createElement("li");
    listItem.classList.add("phrase-item");

    const baseDiv = document.createElement("div");
    baseDiv.classList.add("phrase-base", "phrase");
    baseDiv.id = base.getKey();
    baseDiv.textContent = base.getPhrase();

    const targetDiv = document.createElement("div");
    targetDiv.classList.add("phrase-target", "phrase");
    targetDiv.id = target.getKey();
    targetDiv.textContent = target.getPhrase();

    // ✅ Append to the list item
    listItem.appendChild(baseDiv);
    listItem.appendChild(targetDiv);

    // ✅ Append to the list
    listElement.appendChild(listItem);
}
