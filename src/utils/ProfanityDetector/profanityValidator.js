const fs = require('fs').promises;
const Filter = require('bad-words');
var filter = null;

function simplify(word) {
    word = word.toLowerCase();
    let simplifiedWord = '';

    for (let i = 0; i < word.length; i++) {
        switch (word[i]) {
            case '0':
                simplifiedWord += 'o';
                break;
            case '1':
                simplifiedWord += 'l';
                break;
            case '3':
                simplifiedWord += 'e';
                break;
            case '5':
                simplifiedWord += 's';
                break;
            case '7':
                simplifiedWord += 't';
                break;
            case '@':
                simplifiedWord += 'a';
                break;
            case '$':
                simplifiedWord += 's';
                break;
            case 'ă':
                simplifiedWord += 'a';
                break;
            case 'â':
                simplifiedWord += 'a';
                break;
            case 'ț':
                simplifiedWord += 't';
                break;
            case 'ș':
                simplifiedWord += 's';
                break;
            case '-':
                break;
            default:
                simplifiedWord += word[i];
        }
    }

    let i = 1;
    let consecutives = 0;
    let finalWord = simplifiedWord[0];
    while( i < simplifiedWord.length){


        if(simplifiedWord[i] == simplifiedWord[i - 1])
            consecutives++;
        else
            consecutives = 0;

        if(consecutives < 1){
            finalWord += simplifiedWord[i];
        }
        i++;
    }

    return finalWord;
}

async function init() {
    try {
        const jsonData = await fs.readFile("./src/utils/ProfanityDetector/profanity_dataset.json", 'utf8');
        const data = JSON.parse(jsonData);

        filter = new Filter({ replaceRegex: /([A-Z]|[a-z]|[0-9]|\@)/g });
        filter.removeWords('cum');
        filter.removeWords('bum');

        data.profanity_list.forEach(word => {
            filter.addWords(word);
        });
    } catch (err) {
        console.error('Error initializing profanity filter:', err);
    }
}

function splitByList(text, separators) {
    const separatorPattern = separators.map(sep => escapeRegExp(sep)).join('|');
    const regex = new RegExp(separatorPattern, 'g');
    return text.split(regex);
}

function escapeRegExp(string) {
    return string.replace(/[.*+-?!^${}()|[\]\\]/g, '\\$&');
}

async function isProfanity(input) {
    
    if (!filter) {
        console.error('Profanity filter is not initialized. Call init() first.');
        return;
    }

    const separators = [',', ' ', '!', '?', '.', ':', ';'];
    const splittedInput = splitByList(input, separators);

    let isProfane = false;
    let badWords = [];
    splittedInput.forEach(word => {

        if (word !== "") {
            const cleanedWord = simplify(word);
            if (cleanedWord !== null) {
                if (filter.isProfane(cleanedWord)) {

                    isProfane = true;
                    badWords.push(word);
                } 
            }
        }
    });
    return JSON.stringify({"status" : isProfane, "words" : badWords});//(status, word) null if none found else the first bad word found
}

async function checkProfanity(text) {
    await init();
    let res = await isProfanity(text);
    return res;
}

module.exports = checkProfanity;



