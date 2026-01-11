// Kana character data with stroke order information and templates
// Each kana includes: character, romaji, and simplified stroke hints

export const hiraganaData = [
    // Vowels
    { char: 'あ', romaji: 'a', strokes: 3 },
    { char: 'い', romaji: 'i', strokes: 2 },
    { char: 'う', romaji: 'u', strokes: 2 },
    { char: 'え', romaji: 'e', strokes: 2 },
    { char: 'お', romaji: 'o', strokes: 3 },

    // K row
    { char: 'か', romaji: 'ka', strokes: 3 },
    { char: 'き', romaji: 'ki', strokes: 4 },
    { char: 'く', romaji: 'ku', strokes: 1 },
    { char: 'け', romaji: 'ke', strokes: 3 },
    { char: 'こ', romaji: 'ko', strokes: 2 },

    // S row
    { char: 'さ', romaji: 'sa', strokes: 3 },
    { char: 'し', romaji: 'shi', strokes: 1 },
    { char: 'す', romaji: 'su', strokes: 2 },
    { char: 'せ', romaji: 'se', strokes: 3 },
    { char: 'そ', romaji: 'so', strokes: 1 },

    // T row
    { char: 'た', romaji: 'ta', strokes: 4 },
    { char: 'ち', romaji: 'chi', strokes: 2 },
    { char: 'つ', romaji: 'tsu', strokes: 1 },
    { char: 'て', romaji: 'te', strokes: 1 },
    { char: 'と', romaji: 'to', strokes: 2 },

    // N row
    { char: 'な', romaji: 'na', strokes: 4 },
    { char: 'に', romaji: 'ni', strokes: 3 },
    { char: 'ぬ', romaji: 'nu', strokes: 2 },
    { char: 'ね', romaji: 'ne', strokes: 2 },
    { char: 'の', romaji: 'no', strokes: 1 },

    // H row
    { char: 'は', romaji: 'ha', strokes: 3 },
    { char: 'ひ', romaji: 'hi', strokes: 1 },
    { char: 'ふ', romaji: 'fu', strokes: 4 },
    { char: 'へ', romaji: 'he', strokes: 1 },
    { char: 'ほ', romaji: 'ho', strokes: 4 },

    // M row
    { char: 'ま', romaji: 'ma', strokes: 3 },
    { char: 'み', romaji: 'mi', strokes: 2 },
    { char: 'む', romaji: 'mu', strokes: 3 },
    { char: 'め', romaji: 'me', strokes: 2 },
    { char: 'も', romaji: 'mo', strokes: 3 },

    // Y row
    { char: 'や', romaji: 'ya', strokes: 3 },
    { char: 'ゆ', romaji: 'yu', strokes: 2 },
    { char: 'よ', romaji: 'yo', strokes: 2 },

    // R row
    { char: 'ら', romaji: 'ra', strokes: 2 },
    { char: 'り', romaji: 'ri', strokes: 2 },
    { char: 'る', romaji: 'ru', strokes: 1 },
    { char: 'れ', romaji: 're', strokes: 1 },
    { char: 'ろ', romaji: 'ro', strokes: 1 },

    // W row
    { char: 'わ', romaji: 'wa', strokes: 2 },
    { char: 'を', romaji: 'wo', strokes: 3 },
    { char: 'ん', romaji: 'n', strokes: 1 },
];

export const katakanaData = [
    // Vowels
    { char: 'ア', romaji: 'a', strokes: 2 },
    { char: 'イ', romaji: 'i', strokes: 2 },
    { char: 'ウ', romaji: 'u', strokes: 3 },
    { char: 'エ', romaji: 'e', strokes: 3 },
    { char: 'オ', romaji: 'o', strokes: 3 },

    // K row
    { char: 'カ', romaji: 'ka', strokes: 2 },
    { char: 'キ', romaji: 'ki', strokes: 3 },
    { char: 'ク', romaji: 'ku', strokes: 2 },
    { char: 'ケ', romaji: 'ke', strokes: 3 },
    { char: 'コ', romaji: 'ko', strokes: 2 },

    // S row
    { char: 'サ', romaji: 'sa', strokes: 3 },
    { char: 'シ', romaji: 'shi', strokes: 3 },
    { char: 'ス', romaji: 'su', strokes: 2 },
    { char: 'セ', romaji: 'se', strokes: 2 },
    { char: 'ソ', romaji: 'so', strokes: 2 },

    // T row
    { char: 'タ', romaji: 'ta', strokes: 3 },
    { char: 'チ', romaji: 'chi', strokes: 3 },
    { char: 'ツ', romaji: 'tsu', strokes: 3 },
    { char: 'テ', romaji: 'te', strokes: 3 },
    { char: 'ト', romaji: 'to', strokes: 2 },

    // N row
    { char: 'ナ', romaji: 'na', strokes: 2 },
    { char: 'ニ', romaji: 'ni', strokes: 2 },
    { char: 'ヌ', romaji: 'nu', strokes: 2 },
    { char: 'ネ', romaji: 'ne', strokes: 4 },
    { char: 'ノ', romaji: 'no', strokes: 1 },

    // H row
    { char: 'ハ', romaji: 'ha', strokes: 2 },
    { char: 'ヒ', romaji: 'hi', strokes: 2 },
    { char: 'フ', romaji: 'fu', strokes: 2 },
    { char: 'ヘ', romaji: 'he', strokes: 1 },
    { char: 'ホ', romaji: 'ho', strokes: 4 },

    // M row
    { char: 'マ', romaji: 'ma', strokes: 2 },
    { char: 'ミ', romaji: 'mi', strokes: 3 },
    { char: 'ム', romaji: 'mu', strokes: 2 },
    { char: 'メ', romaji: 'me', strokes: 2 },
    { char: 'モ', romaji: 'mo', strokes: 3 },

    // Y row
    { char: 'ヤ', romaji: 'ya', strokes: 2 },
    { char: 'ユ', romaji: 'yu', strokes: 2 },
    { char: 'ヨ', romaji: 'yo', strokes: 2 },

    // R row
    { char: 'ラ', romaji: 'ra', strokes: 2 },
    { char: 'リ', romaji: 'ri', strokes: 2 },
    { char: 'ル', romaji: 'ru', strokes: 2 },
    { char: 'レ', romaji: 're', strokes: 1 },
    { char: 'ロ', romaji: 'ro', strokes: 3 },

    // W row
    { char: 'ワ', romaji: 'wa', strokes: 2 },
    { char: 'ヲ', romaji: 'wo', strokes: 3 },
    { char: 'ン', romaji: 'n', strokes: 2 },
];

// Get kana by character
export function getKanaByChar(char, isKatakana = false) {
    const data = isKatakana ? katakanaData : hiraganaData;
    return data.find(k => k.char === char);
}

// Get kana by romaji
export function getKanaByRomaji(romaji, isKatakana = false) {
    const data = isKatakana ? katakanaData : hiraganaData;
    return data.find(k => k.romaji === romaji);
}
