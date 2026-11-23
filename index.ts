import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const nakshatraMap: { [key: string]: string } = {
    "Ashwini": "അശ്വതി", "Bharani": "ഭരണി", "Krittika": "കാർത്തിക", "Kritika": "കാർത്തിക",
    "Rohini": "രോഹിണി", "Mrigashirsha": "മകയിരം", "Ardra": "തിരുവാതിര",
    "Punarvasu": "പുണർതം", "Pushya": "പൂയം", "Ashlesha": "ആയില്യം",
    "Magha": "മകം", "Purva Phalguni": "പൂരം", "Poorva Phalguni": "പൂരം", 
    "Uttara Phalguni": "ഉത്രം", "Hasta": "അത്തം", "Chitra": "ചിത്തിര",
    "Swati": "ചോതി", "Vishakha": "വിശാഖം", "Anuradha": "അനിഴം",
    "Jyeshtha": "തൃക്കേട്ട", "Mula": "മൂലം", "Moola": "മൂലം",
    "Purva Ashadha": "പൂരാടം", "Poorva Ashadha": "പൂരാടം", 
    "Uttara Ashadha": "ഉത്രാടം", "Shravana": "തിരുവോണം", "Dhanishta": "അവിട്ടം",
    "Shatabhisha": "ചതയം", "Purva Bhadrapada": "പൂരൂരുട്ടാതി", 
    "Poorva Bhadrapada": "പൂരൂരുട്ടാതി", "Uttara Bhadrapada": "ഉത്തൃട്ടാതി", 
    "Revati": "രേവതി"
};

const nakshatraListMal = [
    "അശ്വതി", "ഭരണി", "കാർത്തിക", "രോഹിണി", "മകയിരം", "തിരുവാതിര",
    "പുണർതം", "പൂയം", "ആയില്യം", "മകം", "പൂരം", "ഉത്രം",
    "അത്തം", "ചിത്തിര", "ചോതി", "വിശാഖം", "അനിഴം", "തൃക്കേട്ട",
    "മൂലം", "പൂരാടം", "ഉത്രാടം", "തിരുവോണം", "അവിട്ടം", "ചതയം",
    "പൂരൂരുട്ടാതി", "ഉത്തൃട്ടാതി", "രേവതി"
];

const tithiMap: { [key: string]: string } = {
    "Pratipada": "പ്രഥമ", "Dwitiya": "ദ്വിതീയ", "Tritiya": "തൃതീയ",
    "Chaturthi": "ചതുർത്ഥി", "Panchami": "പഞ്ചമി", "Shashthi": "ഷഷ്ഠി",
    "Saptami": "സപ്തമി", "Ashtami": "അഷ്ടമി", "Navami": "നവമി",
    "Dashami": "ദശമി", "Ekadashi": "ഏകാദശി", "Dwadashi": "ദ്വാദശി",
    "Trayodashi": "ത്രയോദശി", "Chaturdashi": "ചതുർദ്ദശി",
    "Purnima": "പൗർണ്ണമി", "Poornima": "പൗർണ്ണമി", "Amavasya": "അമാവാസി"
};

const tithiListMal = [
    "പ്രഥമ", "ദ്വിതീയ", "തൃതീയ", "ചതുർത്ഥി", "പഞ്ചമി",
    "ഷഷ്ഠി", "സപ്തമി", "അഷ്ടമി", "നവമി", "ദശമി",
    "ഏകാദശി", "ദ്വാദശി", "ത്രയോദശി", "ചതുർദ്ദശി", "പൗർണ്ണമി",
    "പ്രഥമ", "ദ്വിതീയ", "തൃതീയ", "ചതുർത്ഥി", "പഞ്ചമി",
    "ഷഷ്ഠി", "സപ്തമി", "അഷ്ടമി", "നവമി", "ദശമി",
    "ഏകാദശി", "ദ്വാദശി", "ത്രയോദശി", "ചതുർദ്ദശി", "അമാവാസി"
];

const yogaListMal = [
    "വിഷ്കംഭം", "പ്രീതി", "ആയുഷ്മാൻ", "സൗഭാഗ്യം", "ശോഭനം",
    "അതിഗണ്ഡം", "സുകർമ്മം", "ധൃതി", "ശൂലം", "ഗണ്ഡം",
    "വൃദ്ധി", "ധ്രുവം", "വ്യാഘാതം", "ഹർഷണം", "വജ്രം",
    "സിദ്ധി", "വ്യതീപാതം", "വരീയാൻ", "പരിഘം", "ശിവം",
    "സിദ്ധം", "സാദ്ധ്യം", "ശുഭം", "ശുക്ലം", "ബ്രഹ്മം",
    "ഇന്ദ്രം", "വൈധൃതി"
];

const movableKaranaListMal = [
    "ബവം", "ബാലവം", "കൗലവം", "തൈതിലം", "ഗരം", "വണിജം", "വിഷ്ടി"
];

const rashiListMal = [
    "മേടം", "ഇടവം", "മിഥുനം", "കർക്കടകം", "ചിങ്ങം", "കന്നി",
    "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"
];

const rashiNakshatrasMap: { [key: number]: string[] } = {
    0: ["അശ്വതി", "ഭരണി", "കാർത്തിക"],
    1: ["കാർത്തിക", "രോഹിണി", "മകയിരം"],
    2: ["മകയിരം", "തിരുവാതിര", "പുണർതം"],
    3: ["പുണർതം", "പൂയം", "ആയില്യം"],
    4: ["മകം", "പൂരം", "ഉത്രം"],
    5: ["ഉത്രം", "അത്തം", "ചിത്തിര"],
    6: ["ചിത്തിര", "ചോതി", "വിശാഖം"],
    7: ["വിശാഖം", "അനിഴം", "തൃക്കേട്ട"],
    8: ["മൂലം", "പൂരാടം", "ഉത്രാടം"],
    9: ["ഉത്രാടം", "തിരുവോണം", "അവിട്ടം"],
    10: ["അവിട്ടം", "ചതയം", "പൂരൂരുട്ടാതി"],
    11: ["പൂരൂരുട്ടാതി", "ഉത്തൃട്ടാതി", "രേവതി"]
};

const malMonthMap: { [key: number]: string } = {
    1: "മേടം", 2: "ഇടവം", 3: "മിഥുനം", 4: "കർക്കടകം", 5: "ചിങ്ങം", 6: "കന്നി",
    7: "തുലാം", 8: "വൃശ്ചികം", 9: "ധനു", 10: "മകരം", 11: "കുംഭം", 12: "മീനം"
};

const tamMonthMap: { [key: number]: string } = {
    1: "ചിത്തിര", 2: "വൈകാശി", 3: "ആനി", 4: "ആടി", 5: "ആവണി", 6: "പുരട്ടാശി",
    7: "ഐപ്പശി", 8: "കാർത്തിക", 9: "മാർകഴി", 10: "തൈ", 11: "മാശി", 12: "പാൻഗുനി"
};

const malGregorianMonthMap: { [key: number]: string } = {
    1: "ജനുവരി", 2: "ഫെബ്രുവരി", 3: "മാർച്ച്", 4: "ഏപ്രിൽ",
    5: "മെയ്", 6: "ജൂൺ", 7: "ജൂലൈ", 8: "ഓഗസ്റ്റ്",
    9: "സെപ്റ്റംബർ", 10: "ഒക്ടോബർ", 11: "നവംബർ", 12: "ഡിസംബർ"
};

const njattuvelaList = [
    "അശ്വതി", "ഭരണി", "കാർത്തിക", "രോഹിണി", "മകയിരം", "തിരുവാതിര",
    "പുണർതം", "പൂയം", "ആയില്യം", "മകം", "പൂരം", "ഉത്രം",
    "അത്തം", "ചിത്തിര", "ചോതി", "വിശാഖം", "അനിഴം", "തൃക്കേട്ട",
    "മൂലം", "പൂരാടം", "ഉത്രാടം", "തിരുവോണം", "അവിട്ടം", "ചതയം",
    "പൂരൂരുട്ടാതി", "ഉത്തൃട്ടാതി", "രേവതി"
];

const rithuMap: { [key: number]: string } = {
    1: "വസന്ത ഋതു", 2: "വസന്ത ഋതു",
    3: "ഗ്രീഷ്മ ഋതു", 4: "ഗ്രീഷ്മ ഋതു",
    5: "വർഷ ഋതു", 6: "വർഷ ഋതു",
    7: "ശരത് ഋതു", 8: "ശരത് ഋതു",
    9: "ഹേമന്ത ഋതു", 10: "ഹേമന്ത ഋതു",
    11: "ശിശിര ഋതു", 12: "ശിശിര ഋതു"
};

const varaadhipanMap: { [key: number]: string } = {
    1: "സൂര്യൻ", 2: "ചന്ദ്രൻ", 3: "ചൊവ്വ", 4: "ബുധൻ",
    5: "വ്യാഴം", 6: "വെള്ളി", 7: "ശനി"
};

const varjyamStartGhati = [
    50, 24, 30, 40, 14, 21, 30, 20, 32, 30, 20, 18, 21, 20, 14, 14, 10, 14, 56, 24, 20, 10, 10, 18, 16, 24, 30
];
const amritakalamStartGhati = [
    42, 48, 54, 52, 38, 35, 54, 44, 56, 54, 44, 42, 45, 44, 38, 38, 34, 38, 44, 48, 44, 34, 34, 42, 40, 48, 54
];

const anandadiYogaTable: string[][] = [
    ["ആനന്ദയോഗം", "കാലദണ്ഡയോഗം", "ധൂമ്രയോഗം", "പ്രജാപതിയോഗം", "സൗമ്യയോഗം", "ധ്വാങ്ക്ഷയോഗം", "ധ്വജയോഗം", "ശ്രീവത്സയോഗം", "വജ്രയോഗം", "മുദ്ഗരയോഗം", "ഛത്രയോഗം", "മിത്രയോഗം", "മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം", "ഉത്പാതയോഗം", "മൃത്യുയോഗം", "കാണയോഗം", "സിദ്ധിയോഗം", "ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം"],
    ["പ്രജാപതിയോഗം", "സൗമ്യയോഗം", "ധ്വാങ്ക്ഷയോഗം", "ധ്വജയോഗം", "ശ്രീവത്സയോഗം", "വജ്രയോഗം", "മുദ്ഗരയോഗം", "ഛത്രയോഗം", "മിത്രയോഗം", "മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം", "ഉത്പാതയോഗം", "മൃത്യുയോഗം", "കാണയോഗം", "സിദ്ധിയോഗം", "ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം", "പ്രവർദ്ധയോഗം", "ആനന്ദയോഗം", "കാലദണ്ഡയോഗം"],
    ["ധ്വജയോഗം", "ശ്രീവത്സയോഗം", "വജ്രയോഗം", "മുദ്ഗരയോഗം", "ഛത്രയോഗം", "മിത്രയോഗം", "മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം", "ഉത്പാതയോഗം", "മൃത്യുയോഗം", "കാണയോഗം", "സിദ്ധിയോഗം", "ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം", "പ്രവർദ്ധയോഗം", "ആനന്ദയോഗം", "കാലദണ്ഡയോഗം", "ധൂമ്രയോഗം", "പ്രജാപതിയോഗം", "സൗമ്യയോഗം"],
    ["മുദ്ഗരയോഗം", "ഛത്രയോഗം", "മിത്രയോഗം", "മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം", "ഉത്പാതയോഗം", "മൃത്യുയോഗം", "കാണയോഗം", "സിദ്ധിയോഗം", "ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം", "പ്രവർദ്ധയോഗം", "ആനന്ദയോഗം", "കാലദണ്ഡയോഗം", "ധൂമ്രയോഗം", "പ്രജാപതിയോഗം", "സൗമ്യയോഗം", "ധ്വാങ്ക്ഷയോഗം", "ധ്വജയോഗം", "ശ്രീവത്സയോഗം"],
    ["മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം", "ഉത്പാതയോഗം", "മൃത്യുയോഗം", "കാണയോഗം", "സിദ്ധിയോഗം", "ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം", "പ്രവർദ്ധയോഗം", "ആനന്ദയോഗം", "കാലദണ്ഡയോഗം", "ധൂമ്രയോഗം", "പ്രജാപതിയോഗം", "സൗമ്യയോഗം", "ധ്വാങ്ക്ഷയോഗം", "ധ്വജയോഗം", "ശ്രീവത്സയോഗം", "വജ്രയോഗം", "മുദ്ഗരയോഗം", "ഛത്രയോഗം"],
    ["മൃത്യുയോഗം", "കാണയോഗം", "സിദ്ധിയോഗം", "ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം", "പ്രവർദ്ധയോഗം", "ആനന്ദയോഗം", "കാലദണ്ഡയോഗം", "ധൂമ്രയോഗം", "പ്രജാപതിയോഗം", "സൗമ്യയോഗം", "ധ്വാങ്ക്ഷയോഗം", "ധ്വജയോഗം", "ശ്രീവത്സയോഗം", "വജ്രയോഗം", "മുദ്ഗരയോഗം", "ഛത്രയോഗം", "മിത്രയോഗം", "മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം"],
    ["ശുഭയോഗം", "അമൃതയോഗം", "മുസലയോഗം", "ഗദയോഗം", "മാതംഗയോഗം", "രാക്ഷസയോഗം", "ചരയോഗം", "സ്ഥിരയോഗം", "പ്രവർദ്ധയോഗം", "ആനന്ദയോഗം", "കാലദണ്ഡയോഗം", "ധൂമ്രയോഗം", "പ്രജാപതിയോഗം", "സൗമ്യയോഗം", "ധ്വാങ്ക്ഷയോഗം", "ധ്വജയോഗം", "ശ്രീവത്സയോഗം", "വജ്രയോഗം", "മുദ്ഗരയോഗം", "ഛത്രയോഗം", "മിത്രയോഗം", "മാനസയോഗം", "പദ്മയോഗം", "ലുമ്പകയോഗം", "ഉത്പാതയോഗം", "മൃത്യുയോഗം", "കാണയോഗം"]
];

const numToMal: { [key: number]: string } = {
    0: "പൂജ്യം", 1: "ഒന്ന്", 2: "രണ്ട്", 3: "മൂന്ന്", 4: "നാല്", 5: "അഞ്ച്",
    6: "ആറ്", 7: "ഏഴ്", 8: "എട്ട്", 9: "ഒൻപത്", 10: "പത്ത്",
    11: "പതിനൊന്ന്", 12: "പന്ത്രണ്ട്", 13: "പതിമൂന്ന്", 14: "പതിനാല്", 15: "പതിനഞ്ച്",
    16: "പതിനാറ്", 17: "പതിനേഴ്", 18: "പതിനെട്ട്", 19: "പത്തൊൻപത്", 20: "ഇരുപത്",
    30: "മുപ്പത്", 40: "നാൽപത്", 50: "അമ്പത്", 60: "അറുപത്", 70: "എഴുപത്",
    80: "എൺപത്", 90: "തൊണ്ണൂറ്", 100: "നൂറ്"
};

function numberToMalayalam(n: number): string {
    if (numToMal[n]) return numToMal[n];
    if (n > 20 && n < 100) {
        const tens = Math.floor(n / 10) * 10;
        const units = n % 10;
        return `${numToMal[tens]}ത്തി ${numToMal[units]}`;
    }
    return String(n);
}

function formatTimeSpoken(timeStr: string): string {
    if (!timeStr || timeStr === "ലഭ്യമല്ല") return "ലഭ്യമല്ല";
    const parts = timeStr.split(':').map(Number);
    if (parts.length < 2) return timeStr;
    
    let h = parts[0];
    const m = parts[1];

    let period = "രാവിലെ ";
    if (h >= 18) period = "രാത്രി ";
    else if (h >= 16) period = "വൈകുന്നേരം ";
    else if (h >= 12) period = "ഉച്ചയ്ക്ക് ";
    else if (h < 5) period = "പുലർച്ചെ ";

    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const hWord = numberToMalayalam(h12);

    if (m === 0) {
        return `${period}${hWord} മണി`;
    } else if (m === 30) {
        return `${period}${h12 === 12 ? 'പന്ത്രണ്ടര' : hWord + 'ര'}`;
    } else {
        const mWord = numberToMalayalam(m);
        return `${period}${h12} മണി, ${mWord} മിനിറ്റ്`;
    }
}

function formatExactTimeIst(utcMs: number): { dateText: string; timeText: string; fullText: string } {
    const roundedUtcMs = Math.round(utcMs / 60000) * 60000;
    const istMs = roundedUtcMs + (5.5 * 3600 * 1000);
    const d = new Date(istMs);
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const h = d.getUTCHours();
    const min = d.getUTCMinutes();

    let period = "രാവിലെ ";
    if (h >= 18) period = "രാത്രി ";
    else if (h >= 16) period = "വൈകുന്നേരം ";
    else if (h >= 12) period = "ഉച്ചയ്ക്ക് ";
    else if (h < 5) period = "പുലർച്ചെ ";

    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    const hWord = numberToMalayalam(h12);
    const mWord = numberToMalayalam(min);

    const timeText = min === 0
        ? `${period}${hWord} മണി`
        : `${period}${hWord} മണി, ${mWord} മിനിറ്റ്`;

    const monthName = malGregorianMonthMap[m] || String(m);
    const dateText = `${monthName} ${day} ആം തീയതി`;

    return {
        dateText,
        timeText,
        fullText: `${dateText}, ${timeText}`
    };
}

function formatUdayalparamNazhika(sunriseUtcMs: number, endUtcMs: number): string {
    const diffMins = (endUtcMs - sunriseUtcMs) / 60000.0;
    if (diffMins <= 0 || diffMins >= 1440) return "";

    const totalNazhika = diffMins / 24.0;
    let nazhika = Math.floor(totalNazhika);
    let vinazhika = Math.round((totalNazhika - nazhika) * 60);
    if (vinazhika === 60) {
        nazhika += 1;
        vinazhika = 0;
    }
    if (nazhika >= 60) return "";

    const nWord = numberToMalayalam(nazhika);
    const vWord = numberToMalayalam(vinazhika);
    return vinazhika === 0
        ? `ഉദയാൽപരം, ${nWord} നാഴിക, വരെ ആണ്.`
        : `ഉദയാൽപരം, ${nWord} നാഴിക, ${vWord} വിനാഴിക, വരെ ആണ്.`;
}

function timeToMins(t: string): number {
    if (!t) return 0;
    const parts = t.split(':').map(Number);
    return (parts[0] * 60) + parts[1];
}

function minsToTime(m: number): string {
    const normalized = ((m % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const mins = Math.floor(normalized % 60);
    return `${String(h).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// ESP32 മെമ്മറി സുരക്ഷയ്ക്കായി ഒരൊറ്റ ചങ്കും 74 ബൈറ്റ്സിൽ കൂടാതെ സൂക്ഷിക്കുന്ന ഫിൽട്ടർ
function enforceEsp32ChunkLimit(text: string, maxBytes: number = 74): string {
    const tokens = text.split(/([,.])/);
    let result = "";
    for (let i = 0; i < tokens.length; i += 2) {
        const segment = tokens[i];
        const punct = tokens[i + 1] || "";
        if (!segment.trim()) {
            result += segment + punct;
            continue;
        }
        const leadingSpace = segment.match(/^\s*/)?.[0] || "";
        const words = segment.trim().split(/\s+/);
        let current = "";
        const subChunks: string[] = [];

        for (const w of words) {
            const candidate = current ? `${current} ${w}` : w;
            if (Buffer.byteLength(candidate, 'utf8') <= maxBytes) {
                current = candidate;
            } else {
                if (current) subChunks.push(current);
                current = w;
            }
        }
        if (current) subChunks.push(current);
        result += leadingSpace + subChunks.join(", ") + punct;
    }
    return result;
}

// ==========================================
// NASA JPL HORIZONS ASTRONOMY ENGINE (THIRUKANITHA EXACT)
// ==========================================

interface EphemPoint {
    utcMs: number;
    sidLon: number;
}

const monthAbbrToNum: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
};

function getLahiriAyanamsa(utcMs: number): number {
    const ttMs = utcMs + 69200;
    const jd = (ttMs / 86400000.0) + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;

    const meanAyanamsa = 23.8570923333 + (5029.0966 * T + 1.11113 * T * T) / 3600.0;

    const deg2rad = Math.PI / 180.0;
    const D = (297.85036 + 445267.111480 * T) * deg2rad;
    const M = (357.52772 + 35999.050340 * T) * deg2rad;
    const Mp = (134.96298 + 477198.867398 * T) * deg2rad;
    const F = (93.27191 + 483202.017538 * T) * deg2rad;
    const Omega = (125.04452 - 1934.136261 * T) * deg2rad;

    const deltaPsiArcsec =
        (-17.1996 - 0.01742 * T) * Math.sin(Omega) -
        1.3187 * Math.sin(2 * F - 2 * D + 2 * Omega) -
        0.2274 * Math.sin(2 * F + 2 * Omega) +
        0.2062 * Math.sin(2 * Omega) +
        0.1426 * Math.sin(M) -
        0.1312 * Math.sin(Mp + 2 * F - 2 * D + 2 * Omega);

    return meanAyanamsa + (deltaPsiArcsec / 3600.0);
}

function parseHorizonsEphemeris(resultText: string): EphemPoint[] {
    const soeIdx = resultText.indexOf("$$SOE");
    const eoeIdx = resultText.indexOf("$$EOE");
    if (soeIdx === -1 || eoeIdx === -1) return [];

    const lines = resultText.slice(soeIdx + 5, eoeIdx).trim().split('\n');
    const points: EphemPoint[] = [];

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        const match = line.match(/^(\d{4})-([A-Za-z]{3})-(\d{2})\s+(\d{2}):(\d{2})\s+([+-]?\d+\.\d+)/);
        if (match) {
            const yr = parseInt(match[1], 10);
            const mo = monthAbbrToNum[match[2]];
            const dy = parseInt(match[3], 10);
            const hr = parseInt(match[4], 10);
            const mn = parseInt(match[5], 10);
            const tropLon = parseFloat(match[6]);

            const utcMs = Date.UTC(yr, mo, dy, hr, mn, 0);
            const ayanamsa = getLahiriAyanamsa(utcMs);
            const sidLon = ((tropLon - ayanamsa) % 360 + 360) % 360;
            points.push({ utcMs, sidLon });
        }
    }
    return points;
}

function getValueAtMs(series: EphemPoint[], targetMs: number): number {
    if (series.length === 0) return 0;
    if (targetMs <= series[0].utcMs) return series[0].sidLon;
    if (targetMs >= series[series.length - 1].utcMs) return series[series.length - 1].sidLon;

    let lo = 0;
    let hi = series.length - 1;
    while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        if (series[mid].utcMs <= targetMs) lo = mid;
        else hi = mid;
    }

    const p0 = series[lo];
    const p1 = series[hi];
    const fraction = (targetMs - p0.utcMs) / (p1.utcMs - p0.utcMs);
    let delta = p1.sidLon - p0.sidLon;
    if (delta < -180) delta += 360;
    if (delta > 180) delta -= 360;
    return ((p0.sidLon + fraction * delta) % 360 + 360) % 360;
}

function findCrossingMs(
    series: EphemPoint[],
    refMs: number,
    targetDeg: number,
    direction: 'backward' | 'forward'
): number {
    const stepMs = 15 * 60 * 1000;
    const maxHours = 40;
    let tPrev = refMs;
    let dPrev = ((getValueAtMs(series, tPrev) - targetDeg + 180) % 360 + 360) % 360 - 180;

    for (let i = 1; i <= maxHours * 4; i++) {
        const tCurr = direction === 'backward' ? refMs - i * stepMs : refMs + i * stepMs;
        const dCurr = ((getValueAtMs(series, tCurr) - targetDeg + 180) % 360 + 360) % 360 - 180;

        if ((dPrev <= 0 && dCurr >= 0) || (dPrev >= 0 && dCurr <= 0)) {
            let a = Math.min(tPrev, tCurr);
            let b = Math.max(tPrev, tCurr);
            for (let iter = 0; iter < 24; iter++) {
                const m = (a + b) / 2;
                const dA = ((getValueAtMs(series, a) - targetDeg + 180) % 360 + 360) % 360 - 180;
                const dM = ((getValueAtMs(series, m) - targetDeg + 180) % 360 + 360) % 360 - 180;
                if ((dA <= 0 && dM >= 0) || (dA >= 0 && dM <= 0)) {
                    b = m;
                } else {
                    a = m;
                }
            }
            return (a + b) / 2;
        }
        tPrev = tCurr;
        dPrev = dCurr;
    }
    return refMs;
}

function parseMoonRiseSet(resultText: string, year: number, month: number, day: number): { moonrise: string; moonset: string } {
    const soeIdx = resultText.indexOf("$$SOE");
    const eoeIdx = resultText.indexOf("$$EOE");
    if (soeIdx === -1 || eoeIdx === -1) return { moonrise: "", moonset: "" };

    const lines = resultText.slice(soeIdx + 5, eoeIdx).trim().split('\n');
    let moonrise = "";
    let moonset = "";

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        const match = line.match(/^(\d{4})-([A-Za-z]{3})-(\d{2})\s+(\d{2}):(\d{2})\s+(?:[*CNAm]\s*)?([rts])(?:\s|$)/);
        if (match) {
            const yr = parseInt(match[1], 10);
            const mo = monthAbbrToNum[match[2]];
            const dy = parseInt(match[3], 10);
            const hr = parseInt(match[4], 10);
            const mn = parseInt(match[5], 10);
            const eventType = match[6];

            const utcMs = Date.UTC(yr, mo, dy, hr, mn, 0);
            const istMs = utcMs + (5.5 * 3600 * 1000);
            const d = new Date(istMs);

            if (d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month && d.getUTCDate() === day) {
                const hhmm = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
                if (eventType === 'r' && !moonrise) moonrise = hhmm;
                if (eventType === 's' && !moonset) moonset = hhmm;
            }
        }
    }
    return { moonrise, moonset };
}

function formatDateStr(utcMs: number): string {
    const d = new Date(utcMs);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

async function fetchNasaPanchangData(year: number, month: number, day: number, lat: number, lng: number) {
    const defaultSunriseUtcMs = Date.UTC(year, month - 1, day, 0, 30, 0);
    const startDateStr = formatDateStr(defaultSunriseUtcMs - 36 * 3600 * 1000);
    const stopDateStr = formatDateStr(defaultSunriseUtcMs + 48 * 3600 * 1000);

    const moonUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='301'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${startDateStr}%2000:00'&STOP_TIME='${stopDateStr}%2000:00'&STEP_SIZE='15m'&QUANTITIES='31'`;
    const sunUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='10'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${startDateStr}%2000:00'&STOP_TIME='${stopDateStr}%2000:00'&STEP_SIZE='15m'&QUANTITIES='31'`;
    const rtsUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='301'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='coord@399'&COORD_TYPE='GEODETIC'&SITE_COORD='${lng},${lat},0'&START_TIME='${startDateStr}%2000:00'&STOP_TIME='${stopDateStr}%2000:00'&STEP_SIZE='10m'&QUANTITIES='4'&RISE_TRANS='RTS'`;

    const [moonRes, sunRes, rtsRes] = await Promise.all([
        axios.get(moonUrl, { timeout: 12000 }),
        axios.get(sunUrl, { timeout: 12000 }),
        axios.get(rtsUrl, { timeout: 12000 })
    ]);

    const moonSeries = parseHorizonsEphemeris(moonRes.data?.result || "");
    const sunSeries = parseHorizonsEphemeris(sunRes.data?.result || "");
    const rtsData = parseMoonRiseSet(rtsRes.data?.result || "", year, month, day);

    if (moonSeries.length < 10 || sunSeries.length < 10) {
        return null;
    }

    const tithiDiffSeries: EphemPoint[] = [];
    const yogaSumSeries: EphemPoint[] = [];
    for (let i = 0; i < Math.min(moonSeries.length, sunSeries.length); i++) {
        const mLon = moonSeries[i].sidLon;
        const sLon = sunSeries[i].sidLon;
        tithiDiffSeries.push({
            utcMs: moonSeries[i].utcMs,
            sidLon: ((mLon - sLon) % 360 + 360) % 360
        });
        yogaSumSeries.push({
            utcMs: moonSeries[i].utcMs,
            sidLon: ((mLon + sLon) % 360 + 360) % 360
        });
    }

    return {
        defaultSunriseUtcMs,
        moonSeries,
        sunSeries,
        tithiDiffSeries,
        yogaSumSeries,
        moonrise: rtsData.moonrise,
        moonset: rtsData.moonset
    };
}

app.get('/api/panchangam', async (req: Request, res: Response) => {
    try {
        const options: Intl.DateTimeFormatOptions = { 
            timeZone: 'Asia/Kolkata', 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric' 
        };
        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const parts = formatter.formatToParts(new Date());
        
        let year = 2026, month = 11, day = 24;
        for (const p of parts) {
            if (p.type === 'year') year = parseInt(p.value);
            if (p.type === 'month') month = parseInt(p.value);
            if (p.type === 'day') day = parseInt(p.value);
        }

        const lat = 10.9156;
        const lng = 75.9236;

        // നിലവിലെ API-യും NASA JPL Horizons API-യും ഒരേസമയം വിളിക്കുന്നു
        const [astroResponse, nasaData] = await Promise.all([
            axios.post("https://api.freeastroapi.com/api/v2/vedic/panchang", {
                year: year, month: month, day: day,
                hour: 6, minute: 0, city: "Tirur",
                lat: lat, lng: lng, tz_str: "Asia/Kolkata"
            }, {
                headers: { 
                    "Content-Type": "application/json",
                    "x-api-key": process.env.ASTRO_API_KEY 
                }
            }),
            fetchNasaPanchangData(year, month, day, lat, lng).catch((err) => {
                console.error("NASA JPL Horizons fallback triggered:", err.message);
                return null;
            })
        ]);

        const data = astroResponse.data;

        // ==========================================
        // 1. നിലവിലുള്ള API വിവരങ്ങൾ (അതേ അളവിലും ഘടനയിലും)
        // ==========================================
        const weekdayNum = data?.weekday?.number || 1;
        const dayIndex = weekdayNum - 1;
        const varaadhipanName = varaadhipanMap[weekdayNum] || "";
        const varaadhipanText = varaadhipanName ? `ഇന്നത്തെ വാരാധിപൻ, ${varaadhipanName}, ആണ്.` : "";

        let gulikaStartRaw = "", gulikaEndRaw = "";
        let yamaStartRaw = "", yamaEndRaw = "";
        let abhijitStartRaw = "", abhijitEndRaw = "";
        let durmuhurthamStartRaw = "", durmuhurthamEndRaw = "";

        if (data?.sunrise && data?.sunset && data?.weekday?.number) {
            const srMins = timeToMins(data.sunrise);
            const ssMins = timeToMins(data.sunset);
            const dayLength = ssMins - srMins;
            const partLength = dayLength / 8; 
            
            const yamaParts = [5, 4, 3, 2, 1, 7, 6]; 
            const gulikaParts = [7, 6, 5, 4, 3, 2, 1]; 

            const yamaStartMin = srMins + ((yamaParts[dayIndex] - 1) * partLength);
            yamaStartRaw = minsToTime(yamaStartMin);
            yamaEndRaw = minsToTime(yamaStartMin + partLength);

            const gulikaStartMin = srMins + ((gulikaParts[dayIndex] - 1) * partLength);
            gulikaStartRaw = minsToTime(gulikaStartMin);
            gulikaEndRaw = minsToTime(gulikaStartMin + partLength);

            const muhurtaLength = dayLength / 15;
            const midday = srMins + (dayLength / 2);
            abhijitStartRaw = minsToTime(midday - (muhurtaLength / 2));
            abhijitEndRaw = minsToTime(midday + (muhurtaLength / 2));

            const durmuhurthamSlots: { [key: number]: number } = {
                0: 13, 1: 8, 2: 7, 3: 11, 4: 6, 5: 9, 6: 10
            };
            const slot = durmuhurthamSlots[dayIndex] || 1;
            const durStartMin = srMins + ((slot - 1) * muhurtaLength);
            durmuhurthamStartRaw = minsToTime(durStartMin);
            durmuhurthamEndRaw = minsToTime(durStartMin + muhurtaLength);
        }

        const sunSignId = data?.request_time_panchang?.sun_sign?.sun_sign_id || data?.request_time_panchang?.sun_sign?.sign_id;
        const sunDegree = data?.request_time_panchang?.sun_sign?.degree;

        let malMonthText = "";
        let njattuvelaText = "";
        let rithuText = "";
        if (sunSignId && sunDegree !== undefined) {
            const malMonth = malMonthMap[sunSignId] || "";
            const tamMonth = tamMonthMap[sunSignId] || "";
            const solarDate = Math.floor(sunDegree) + 1; 
            
            let kollaVarsham = year - 825;
            if (month > 8 || (month === 8 && day >= 17)) {
                kollaVarsham = year - 824;
            }

            malMonthText = `കൊല്ലവർഷം ${kollaVarsham} ${malMonth} മാസം, ${solarDate}ആം തീയതി. തമിഴ് മാസം, ${tamMonth}, ${solarDate} ആം തീയതി.`;

            const totalSunDegrees = ((sunSignId - 1) * 30) + sunDegree;
            const nakshatraIndex = Math.floor(totalSunDegrees / 13.3333) % 27;
            const njattuvelaName = njattuvelaList[nakshatraIndex] || "തിരുവാതിര";
            njattuvelaText = `ഇന്നത്തെ ഞാറ്റുവേല, ${njattuvelaName}, ഞാറ്റുവേലയാണ്.`;

            const rithuName = rithuMap[sunSignId] || "വസന്ത ഋതു";
            rithuText = `ഇന്നത്തെ ഋതു, ${rithuName}, ആണ്.`;
        }

        const srMins = timeToMins(data?.sunrise);
        const ssMins = timeToMins(data?.sunset);
        const brahmaStartRaw = minsToTime(srMins - 96 < 0 ? srMins - 96 + 1440 : srMins - 96);
        const brahmaEndRaw = minsToTime(srMins - 48 < 0 ? srMins - 48 + 1440 : srMins - 48);

        const rahuStartRaw = data?.rahu_kalam?.start || "";
        const rahuEndRaw = data?.rahu_kalam?.end || "";
        const sunriseRaw = data?.sunrise || "";
        const sunsetRaw = data?.sunset || "";

        let dinamanamText = "";
        if (srMins > 0 && ssMins > srMins) {
            const dayLengthMins = ssMins - srMins;
            const dHours = Math.floor(dayLengthMins / 60);
            const dMins = dayLengthMins % 60;
            const hWord = numberToMalayalam(dHours);
            const mWord = numberToMalayalam(dMins);
            dinamanamText = `ഇന്നത്തെ ദിനമാനം, അഥവാ പകലൻ്റെ ദൈർഘ്യം, ${hWord} മണിക്കൂർ, ${mWord} മിനിറ്റ്, ആണ്.`;
        }

        const brahmaText = (brahmaStartRaw === "ലഭ്യമല്ല") ? "" : `ഇന്നത്തെ ബ്രാഹ്മ മുഹൂർത്തം, പുലർച്ചെ നാല് മണി, മുതൽ, രാവിലെ അഞ്ച് മണി വരെ ആണ്.`;
        const rahuText = !rahuStartRaw ? "രാഹുകാലം ലഭ്യമല്ല." : `രാഹുകാലം, ${formatTimeSpoken(rahuStartRaw)}, മുതൽ, ${formatTimeSpoken(rahuEndRaw)}, വരെ ആണ്.`;
        const gulikaText = !gulikaStartRaw ? "ഗുളികകാലം ലഭ്യമല്ല." : `ഗുളികകാലം, ${formatTimeSpoken(gulikaStartRaw)}, മുതൽ, ${formatTimeSpoken(gulikaEndRaw)}, വരെ ആണ്.`;
        const yamaText = !yamaStartRaw ? "യമഗണ്ഡകാലം ലഭ്യമല്ല." : `യമഗണ്ഡകാലം, ${formatTimeSpoken(yamaStartRaw)}, മുതൽ, ${formatTimeSpoken(yamaEndRaw)}, വരെ ആണ്.`;
        const durmuhurthamText = !durmuhurthamStartRaw ? "ദുർമുഹൂർത്തം ലഭ്യമല്ല." : `ദുർമുഹൂർത്തം, ${formatTimeSpoken(durmuhurthamStartRaw)}, മുതൽ, ${formatTimeSpoken(durmuhurthamEndRaw)}, വരെ ആണ്.`;
        const abhijitText = !abhijitStartRaw ? "അഭിജിത്ത് മുഹൂർത്തം ലഭ്യമല്ല." : `അഭിജിത്ത് മുഹൂർത്തം, ${formatTimeSpoken(abhijitStartRaw)}, മുതൽ, ${formatTimeSpoken(abhijitEndRaw)}, വരെ ആണ്.`;
        
        const sunriseText = !sunriseRaw ? "സൂര്യോദയം ലഭ്യമല്ല." : `ഇന്നത്തെ സൂര്യോദയം, ${formatTimeSpoken(sunriseRaw)}, ആണ്.`;
        const sunsetText = !sunsetRaw ? "സൂര്യാസ്തമയം ലഭ്യമല്ല." : `ഇന്നത്തെ സൂര്യാസ്തമയം, ${formatTimeSpoken(sunsetRaw)}, ആണ്.`;

        // ==========================================
        // 2. NASA JPL HORIZONS കണക്കുകൂട്ടലുകൾ (<= 74 Bytes Chunks)
        // ==========================================
        let ayanamText = "";
        let sankrantiText = "";
        let moonriseText = "";
        let moonsetText = "";
        let illuminationText = "";
        let specialEventText = "";
        let pakshamText = "";
        let tithiDetailText = "";
        let nakshatraDetailText = "";
        let yogaDetailText = "";
        let karanaDetailText = "";
        let moonRashiText = "";
        let chandrabalamText = "";
        let tarabalamText = "";
        let amritakalamText = "";
        let varjyamText = "";
        let anandadiText = "";
        let pushkaraText = "";
        let gandantaText = "";
        let panchakaText = "";
        let pujaVisheshangalText = "";

        const dishaShoolaMap: { [key: number]: string } = {
            0: "പടിഞ്ഞാറ്", 1: "കിഴക്ക്", 2: "വടക്ക്", 3: "വടക്ക്",
            4: "തെക്ക്", 5: "പടിഞ്ഞാറ്", 6: "കിഴക്ക്"
        };
        const dishaName = dishaShoolaMap[dayIndex] || "കിഴക്ക്";
        const dishaShoolaText = `ഇന്നത്തെ ദിക്ശൂലം, അഥവാ ദീർഘയാത്രകൾ, ഒഴിവാക്കേണ്ട ദിശ, ${dishaName}, ആണ്.`;

        if (nasaData) {
            let actualSunriseUtcMs = nasaData.defaultSunriseUtcMs;
            if (sunriseRaw && sunriseRaw.includes(':')) {
                const [srH, srM] = sunriseRaw.split(':').map(Number);
                if (!isNaN(srH) && !isNaN(srM)) {
                    actualSunriseUtcMs = Date.UTC(year, month - 1, day, srH, srM, 0) - (5.5 * 3600 * 1000);
                }
            }

            const refMs = actualSunriseUtcMs;
            const dayStartUtcMs = Date.UTC(year, month - 1, day, 0, 0, 0) - (5.5 * 3600 * 1000);
            const dayEndUtcMs = dayStartUtcMs + (24 * 3600 * 1000);

            const moonLon = getValueAtMs(nasaData.moonSeries, refMs);
            const sunLon = getValueAtMs(nasaData.sunSeries, refMs);
            const tithiDiff = getValueAtMs(nasaData.tithiDiffSeries, refMs);
            const yogaSum = getValueAtMs(nasaData.yogaSumSeries, refMs);

            // A. അയനം & മാസസംക്രമം
            ayanamText = (sunLon >= 270 || sunLon < 90) ? "ഉത്തരായനം." : "ദക്ഷിണായനം.";
            const sunStartLon = getValueAtMs(nasaData.sunSeries, dayStartUtcMs);
            const sunEndLon = getValueAtMs(nasaData.sunSeries, dayEndUtcMs);
            const rashiStart = Math.floor(sunStartLon / 30);
            const rashiEnd = Math.floor(sunEndLon / 30);
            if (rashiStart !== rashiEnd) {
                const targetBoundary = (rashiEnd * 30) % 360;
                const sankrantiMs = findCrossingMs(nasaData.sunSeries, dayStartUtcMs, targetBoundary, 'forward');
                const skFmt = formatExactTimeIst(sankrantiMs);
                sankrantiText = `ഇന്ന്, ${skFmt.timeText}, സമയത്ത്, ${rashiListMal[rashiEnd]} സംക്രമം, നടക്കുന്നു.`;
            }

            // B. ചന്ദ്രോദയം, ചന്ദ്രാസ്തമയം, പ്രകാശമാനത
            if (nasaData.moonrise) {
                moonriseText = `ഇന്നത്തെ ചന്ദ്രോദയം, ${formatTimeSpoken(nasaData.moonrise)}, ആണ്.`;
            }
            if (nasaData.moonset) {
                moonsetText = `ഇന്നത്തെ ചന്ദ്രാസ്തമയം, ${formatTimeSpoken(nasaData.moonset)}, ആണ്.`;
            }
            const illumPct = Math.round(((1 - Math.cos((tithiDiff * Math.PI) / 180)) / 2) * 100);
            illuminationText = `ഇന്ന് ചന്ദ്രൻ, ${numberToMalayalam(illumPct)}, ശതമാനം പ്രകാശമാനമാണ്.`;

            // C. പക്ഷവും തിഥിയും + വിശേഷ വ്രതങ്ങൾ
            const tithiIdx = Math.floor(tithiDiff / 12.0) % 30;
            const tithiNameMal = tithiListMal[tithiIdx] || "പ്രഥമ";
            pakshamText = tithiIdx < 15 ? "വെളുത്ത പക്ഷം." : "കറുത്ത പക്ഷം.";

            const tithiStartMs = findCrossingMs(nasaData.tithiDiffSeries, refMs, tithiIdx * 12.0, 'backward');
            const tithiEndMs = findCrossingMs(nasaData.tithiDiffSeries, refMs, ((tithiIdx + 1) * 12.0) % 360, 'forward');
            const tStartFmt = formatExactTimeIst(tithiStartMs);
            const tEndFmt = formatExactTimeIst(tithiEndMs);

            tithiDetailText = `തിഥി, ${tithiNameMal}. ${tithiNameMal} തിഥി, ആരംഭം, ${tStartFmt.fullText}, മുതൽ. അവസാനം, ${tEndFmt.fullText}, വരെ ആണ്.`;

            // D. നക്ഷത്രം, പാദം, ഉദയാൽപരം നാഴിക-വിനാഴിക
            const nakSpan = 360.0 / 27.0;
            const nakIdx = Math.floor(moonLon / nakSpan) % 27;
            const nakNameMal = nakshatraListMal[nakIdx];
            const padaNum = Math.floor((moonLon % nakSpan) / (nakSpan / 4.0)) + 1;
            const padaWords: { [key: number]: string } = {
                1: "ഒന്നാം പാദം", 2: "രണ്ടാം പാദം", 3: "മൂന്നാം പാദം", 4: "നാലാം പാദം"
            };

            const nakStartMs = findCrossingMs(nasaData.moonSeries, refMs, nakIdx * nakSpan, 'backward');
            const nakEndMs = findCrossingMs(nasaData.moonSeries, refMs, ((nakIdx + 1) * nakSpan) % 360, 'forward');
            const nStartFmt = formatExactTimeIst(nakStartMs);
            const nEndFmt = formatExactTimeIst(nakEndMs);
            const udayalparamText = formatUdayalparamNazhika(actualSunriseUtcMs, nakEndMs);

            nakshatraDetailText = udayalparamText
                ? `ഇന്നത്തെ നക്ഷത്രം, ${nakNameMal}, ${padaWords[padaNum]}, ആണ്. ${udayalparamText} ${nakNameMal} നക്ഷത്രം, ആരംഭം, ${nStartFmt.fullText}, മുതൽ. അവസാനം, ${nEndFmt.fullText}, വരെ ആണ്.`
                : `ഇന്നത്തെ നക്ഷത്രം, ${nakNameMal}, ${padaWords[padaNum]}, ആണ്. ${nakNameMal} നക്ഷത്രം, ആരംഭം, ${nStartFmt.fullText}, മുതൽ. അവസാനം, ${nEndFmt.fullText}, വരെ ആണ്.`;

            // ഇന്നത്തെ വ്രതങ്ങൾ (തിഥി & നക്ഷത്ര വ്രതങ്ങൾ ഉള്ള ദിവസങ്ങളിൽ മാത്രം)
            const vrataParts: string[] = [];
            if (tithiIdx === 14) vrataParts.push("ഇന്ന്, പൗർണ്ണമി വ്രതമാണ്.");
            else if (tithiIdx === 29) vrataParts.push("ഇന്ന്, അമാവാസി ആണ്.");
            else if (tithiIdx === 10 || tithiIdx === 25) vrataParts.push("ഇന്ന്, ഏകാദശി വ്രതമാണ്.");
            else if (tithiIdx === 12 || tithiIdx === 27) vrataParts.push("ഇന്ന്, പ്രദോഷ വ്രതമാണ്.");
            else if (tithiIdx === 3) vrataParts.push("ഇന്ന്, വിനായക ചതുർത്ഥി, വ്രതമാണ്.");
            else if (tithiIdx === 18) vrataParts.push("ഇന്ന്, സങ്കഷ്ടി ചതുർത്ഥി, വ്രതമാണ്.");
            else if (tithiIdx === 5 || tithiIdx === 20) vrataParts.push("ഇന്ന്, ഷഷ്ഠി വ്രതമാണ്.");
            else if (tithiIdx === 7 || tithiIdx === 22) vrataParts.push("ഇന്ന്, അഷ്ടമി വ്രതമാണ്.");
            else if (tithiIdx === 28) vrataParts.push("ഇന്ന്, മാസശിവരാത്രി, വ്രതമാണ്.");

            if (nakIdx === 2) vrataParts.push("ഇന്ന്, കാർത്തിക വ്രതമാണ്.");
            else if (nakIdx === 8) vrataParts.push("ഇന്ന്, ആയില്യം വ്രതമാണ്.");
            else if (nakIdx === 21) vrataParts.push("ഇന്ന്, തിരുവോണം വ്രതമാണ്.");

            if (vrataParts.length > 0) {
                specialEventText = vrataParts.join(" ");
            }

            // E. നിത്യയോഗം
            const yogaIdx = Math.floor(yogaSum / nakSpan) % 27;
            const yogaNameMal = yogaListMal[yogaIdx];
            const yogaStartMs = findCrossingMs(nasaData.yogaSumSeries, refMs, yogaIdx * nakSpan, 'backward');
            const yogaEndMs = findCrossingMs(nasaData.yogaSumSeries, refMs, ((yogaIdx + 1) * nakSpan) % 360, 'forward');
            const yStartFmt = formatExactTimeIst(yogaStartMs);
            const yEndFmt = formatExactTimeIst(yogaEndMs);

            yogaDetailText = `ഇന്നത്തെ നിത്യയോഗം, ${yogaNameMal}, ${yStartFmt.timeText}, മുതൽ. അവസാനം, ${yEndFmt.timeText}, വരെ ആണ്.`;

            // F. കരണം & വിഷ്ടി (ഭദ്ര) കരണം മുന്നറിയിപ്പ്
            const getKaranaLabel = (kIdx: number) => {
                if (kIdx === 0) return "കിംസ്തുഘ്നം";
                if (kIdx === 57) return "ശകുനി";
                if (kIdx === 58) return "ചതുഷ്പാദം";
                if (kIdx === 59) return "നാഗവം";
                return movableKaranaListMal[(kIdx - 1) % 7];
            };

            const karanaIdx1 = Math.floor(tithiDiff / 6.0) % 60;
            const karanaName1 = getKaranaLabel(karanaIdx1);
            const k1StartMs = findCrossingMs(nasaData.tithiDiffSeries, refMs, karanaIdx1 * 6.0, 'backward');
            const k1EndMs = findCrossingMs(nasaData.tithiDiffSeries, refMs, ((karanaIdx1 + 1) * 6.0) % 360, 'forward');
            const k1StartFmt = formatExactTimeIst(k1StartMs);
            const k1EndFmt = formatExactTimeIst(k1EndMs);

            const karanaIdx2 = (karanaIdx1 + 1) % 60;
            const karanaName2 = getKaranaLabel(karanaIdx2);
            const k2EndMs = findCrossingMs(nasaData.tithiDiffSeries, k1EndMs + 60000, ((karanaIdx2 + 1) * 6.0) % 360, 'forward');
            const k2EndFmt = formatExactTimeIst(k2EndMs);

            const karanaIdx3 = (karanaIdx1 + 2) % 60;
            const karanaName3 = getKaranaLabel(karanaIdx3);
            const k3EndMs = findCrossingMs(nasaData.tithiDiffSeries, k2EndMs + 60000, ((karanaIdx3 + 1) * 6.0) % 360, 'forward');
            const k3EndFmt = formatExactTimeIst(k3EndMs);

            let vishtiWarning = "";
            if (karanaName1 === "വിഷ്ടി") {
                vishtiWarning = ` വിഷ്ടി കരണം, അഥവാ ഭദ്ര കരണം, ${k1StartFmt.timeText}, മുതൽ. അവസാനം, ${k1EndFmt.timeText}, വരെ ആണ്. ഈ സമയത്ത്, ശുഭകരവും, മംഗളകരവുമായ, എല്ലാ കാര്യങ്ങളും, ഒഴിവാക്കുക.`;
            } else if (karanaName2 === "വിഷ്ടി" && k1EndMs < dayEndUtcMs) {
                vishtiWarning = ` വിഷ്ടി കരണം, അഥവാ ഭദ്ര കരണം, ${k1EndFmt.timeText}, മുതൽ. അവസാനം, ${k2EndFmt.timeText}, വരെ ആണ്. ഈ സമയത്ത്, ശുഭകരവും, മംഗളകരവുമായ, എല്ലാ കാര്യങ്ങളും, ഒഴിവാക്കുക.`;
            } else if (karanaName3 === "വിഷ്ടി" && k2EndMs < dayEndUtcMs) {
                vishtiWarning = ` വിഷ്ടി കരണം, അഥവാ ഭദ്ര കരണം, ${k2EndFmt.timeText}, മുതൽ. അവസാനം, ${k3EndFmt.timeText}, വരെ ആണ്. ഈ സമയത്ത്, ശുഭകരവും, മംഗളകരവുമായ, എല്ലാ കാര്യങ്ങളും, ഒഴിവാക്കുക.`;
            }

            karanaDetailText = `ഇന്നത്തെ കരണം, ${karanaName1}, ${k1StartFmt.timeText}, മുതൽ. അവസാനം, ${k1EndFmt.timeText}, വരെ ആണ്.${vishtiWarning}`;

            // G. ചന്ദ്രരാശി & കൂറുമാറ്റ സമയം
            const moonRashiIdx = Math.floor(moonLon / 30.0) % 12;
            const moonRashiName = rashiListMal[moonRashiIdx];
            const nextRashiIdx = (moonRashiIdx + 1) % 12;
            const rashiEndMs = findCrossingMs(nasaData.moonSeries, refMs, (nextRashiIdx * 30.0) % 360, 'forward');

            if (rashiEndMs >= dayStartUtcMs && rashiEndMs <= dayEndUtcMs) {
                const rEndFmt = formatExactTimeIst(rashiEndMs);
                moonRashiText = `ഇന്നത്തെ ചന്ദ്രരാശി, ${moonRashiName}, ${rEndFmt.timeText}, വരെ ആണ്. തുടർന്ന്, ${rashiListMal[nextRashiIdx]} രാശിയിലേക്ക്, മാറുന്നു.`;
            } else {
                moonRashiText = `ഇന്നത്തെ ചന്ദ്രരാശി, ${moonRashiName}, ആണ്.`;
            }

            // H. ചന്ദ്രബലവും ചന്ദ്രാഷ്ടമ നക്ഷത്രങ്ങളും (<= 74 Bytes per chunk)
            const r4Name = rashiListMal[(moonRashiIdx + 3) % 12];
            const r8Idx = (moonRashiIdx + 7) % 12;
            const r8Name = rashiListMal[r8Idx];
            const r12Name = rashiListMal[(moonRashiIdx + 11) % 12];
            const ashtamaStars = (rashiNakshatrasMap[r8Idx] || []).join(", ");

            chandrabalamText = [
                `ചന്ദ്രബല പ്രകാരം, നാലാം കൂറായ, ${r4Name}, പന്ത്രണ്ടാം കൂറായ, ${r12Name}, ശ്രദ്ധിക്കുക.`,
                `ഇവർ, യാത്രകളിലും, സാമ്പത്തിക, ഇടപാടുകളിലും, ജാഗ്രത പാലിക്കുക.`,
                `അഷ്ടമക്കൂറായ, ${r8Name} രാശിക്കാർ, തിടുക്കത്തിലുള്ള, തീരുമാനങ്ങൾ, ഒഴിവാക്കുക.`,
                `പ്രത്യേകിച്ച്, ${ashtamaStars}, നക്ഷത്രക്കാർക്ക്, ഇന്ന് ചന്ദ്രാഷ്ടമം, ആണ്.`,
                `ബാക്കിയുള്ള, എല്ലാ കൂറുകാർക്കും, ഇന്ന് ചന്ദ്രബലം, അനുകൂലമാണ്.`
            ].join(" ");

            // I. താരാബലം (<= 74 Bytes per chunk)
            const cautionStars: string[] = [];
            for (let k = 0; k < 27; k++) {
                const tara = (((nakIdx - k + 27) % 27) % 9) + 1;
                if (tara === 3 || tara === 5 || tara === 7) {
                    cautionStars.push(nakshatraListMal[k]);
                }
            }
            const tGroup1 = cautionStars.slice(0, 3).join(", ");
            const tGroup2 = cautionStars.slice(3, 6).join(", ");
            const tGroup3 = cautionStars.slice(6).join(", ");

            tarabalamText = [
                `താരാബല പ്രകാരം, ${tGroup1}, നക്ഷത്രക്കാർ, ശ്രദ്ധിക്കുക.`,
                `കൂടാതെ, ${tGroup2}, നക്ഷത്രക്കാരും, ശ്രദ്ധിക്കുക.`,
                `അതുപോലെ, ${tGroup3}, നക്ഷത്രക്കാർക്കും, ജാഗ്രത വേണം.`,
                `ബാക്കിയുള്ള, എല്ലാ നക്ഷത്രക്കാർക്കും, ഇന്ന് താരാബലം, അനുകൂലമാണ്.`
            ].join(" ");

            // J. അമൃതകാലം & വർജ്ജ്യം
            const nakDurationMs = nakEndMs - nakStartMs;
            const nextNakIdx = (nakIdx + 1) % 27;
            const nextNakEndMs = findCrossingMs(nasaData.moonSeries, nakEndMs + 60000, ((nextNakIdx + 1) * nakSpan) % 360, 'forward');
            const nextNakDurationMs = nextNakEndMs - nakEndMs;

            const amrita1Start = nakStartMs + (amritakalamStartGhati[nakIdx] / 60.0) * nakDurationMs;
            const amrita1End = amrita1Start + (4.0 / 60.0) * nakDurationMs;
            const amrita2Start = nakEndMs + (amritakalamStartGhati[nextNakIdx] / 60.0) * nextNakDurationMs;
            const amrita2End = amrita2Start + (4.0 / 60.0) * nextNakDurationMs;

            if (amrita1End >= dayStartUtcMs && amrita1Start <= dayEndUtcMs) {
                amritakalamText = `അമൃതകാലം, ${formatExactTimeIst(amrita1Start).timeText}, മുതൽ. അവസാനം, ${formatExactTimeIst(amrita1End).timeText}, വരെ ആണ്.`;
            } else if (amrita2End >= dayStartUtcMs && amrita2Start <= dayEndUtcMs) {
                amritakalamText = `അമൃതകാലം, ${formatExactTimeIst(amrita2Start).timeText}, മുതൽ. അവസാനം, ${formatExactTimeIst(amrita2End).timeText}, വരെ ആണ്.`;
            }

            const varjyam1Start = nakStartMs + (varjyamStartGhati[nakIdx] / 60.0) * nakDurationMs;
            const varjyam1End = varjyam1Start + (4.0 / 60.0) * nakDurationMs;
            const varjyam2Start = nakEndMs + (varjyamStartGhati[nextNakIdx] / 60.0) * nextNakDurationMs;
            const varjyam2End = varjyam2Start + (4.0 / 60.0) * nextNakDurationMs;

            if (varjyam1End >= dayStartUtcMs && varjyam1Start <= dayEndUtcMs) {
                varjyamText = `വർജ്ജ്യം, ${formatExactTimeIst(varjyam1Start).timeText}, മുതൽ. അവസാനം, ${formatExactTimeIst(varjyam1End).timeText}, വരെ ആണ്.`;
            } else if (varjyam2End >= dayStartUtcMs && varjyam2Start <= dayEndUtcMs) {
                varjyamText = `വർജ്ജ്യം, ${formatExactTimeIst(varjyam2Start).timeText}, മുതൽ. അവസാനം, ${formatExactTimeIst(varjyam2End).timeText}, വരെ ആണ്.`;
            }

            // K. ആനന്ദാദി യോഗം & ത്രിപുഷ്കര / ദ്വിപുഷ്കര യോഗം
            const anandadiName = anandadiYogaTable[dayIndex]?.[nakIdx] || "";
            if (anandadiName) {
                anandadiText = `ഇന്ന്, ആനന്ദാദി യോഗപ്രകാരം, ${anandadiName}, ആണ്.`;
            }

            const tithiNum1to15 = (tithiIdx % 15) + 1;
            const isBhadraTithi = (tithiNum1to15 === 2 || tithiNum1to15 === 7 || tithiNum1to15 === 12);
            const isPushkaraDay = (dayIndex === 0 || dayIndex === 2 || dayIndex === 6);
            const tripushkaraNaks = [2, 6, 11, 15, 20, 24];
            const dwipushkaraNaks = [4, 13, 22];

            if (isPushkaraDay && isBhadraTithi && tripushkaraNaks.includes(nakIdx)) {
                pushkaraText = `ഇന്ന്, ഫലങ്ങൾ ഇരട്ടിയാകുന്ന, ത്രിപുഷ്കര യോഗം, ഉണ്ട്.`;
            } else if (isPushkaraDay && isBhadraTithi && dwipushkaraNaks.includes(nakIdx)) {
                pushkaraText = `ഇന്ന്, ഫലങ്ങൾ ഇരട്ടിയാകുന്ന, ദ്വിപുഷ്കര യോഗം, ഉണ്ട്.`;
            }

            // L. ഗണ്ഡാന്ത സമയം
            const gandantaZones = [
                { start: 356.6667, nextEnd: 3.3333, isZeroCross: true },
                { start: 116.6667, nextEnd: 123.3333, isZeroCross: false },
                { start: 236.6667, nextEnd: 243.3333, isZeroCross: false }
            ];
            const checkTimes = [dayStartUtcMs, refMs, dayEndUtcMs];
            for (const gz of gandantaZones) {
                const activeMs = checkTimes.find((t) => {
                    const lon = getValueAtMs(nasaData.moonSeries, t);
                    return gz.isZeroCross
                        ? (lon >= 356.6667 || lon <= 3.3333)
                        : (lon >= gz.start && lon <= gz.nextEnd);
                });
                if (activeMs !== undefined) {
                    const gStartMs = findCrossingMs(nasaData.moonSeries, activeMs, gz.start, 'backward');
                    const gEndMs = findCrossingMs(nasaData.moonSeries, activeMs, gz.nextEnd, 'forward');
                    const gStartFmt = formatExactTimeIst(gStartMs);
                    const gEndFmt = formatExactTimeIst(gEndMs);
                    gandantaText = `ഗണ്ഡാന്ത സമയം, ${gStartFmt.timeText}, മുതൽ. അവസാനം, ${gEndFmt.timeText}, വരെ ആണ്.`;
                    break;
                }
            }

            // M. പഞ്ചക ദോഷം
            const panchakaRem = ((tithiIdx + 1) + weekdayNum + (nakIdx + 1) + (moonRashiIdx + 1)) % 9;
            const panchakaMap: { [key: number]: string } = {
                1: "മൃത്യു പഞ്ചക ദോഷം",
                2: "അഗ്നി പഞ്ചക ദോഷം",
                4: "രാജ പഞ്ചക ദോഷം",
                6: "ചോര പഞ്ചക ദോഷം",
                8: "രോഗ പഞ്ചക ദോഷം"
            };
            if (panchakaMap[panchakaRem]) {
                panchakaText = `ഇന്ന്, ${panchakaMap[panchakaRem]}, ഉള്ളതിനാൽ, ശ്രദ്ധിക്കുക.`;
            }

            // N. ഇന്നത്തെ, പൂജാവിശേഷങ്ങൾ (വിശേഷമുള്ള ദിവസങ്ങളിൽ മാത്രം)
            const pujaParts: string[] = [];

            // 1. പ്രദോഷ പൂജാ സമയം
            if ((tithiIdx === 12 || tithiIdx === 27) && ssMins > 0) {
                const pradoshaStartRaw = minsToTime(ssMins - 72);
                const pradoshaEndRaw = minsToTime(ssMins + 72);
                pujaParts.push(`ഇന്ന്, പ്രദോഷ പൂജാ സമയം, ${formatTimeSpoken(pradoshaStartRaw)}, മുതൽ. അവസാനം, ${formatTimeSpoken(pradoshaEndRaw)}, വരെ ആണ്.`);
            }

            // 2. ശിവവാസം (അവസ്ഥയും ഫലവും സഹിതം)
            const shivaRem = (((tithiIdx + 1) * 2) + 5) % 7;
            if (shivaRem === 1) {
                pujaParts.push(`ഇന്ന് ശിവവാസം, കൈലാസത്തിൽ ആണ്. ഇത് സുഖവും, സമാധാനവും നൽകുന്നു. അതിനാൽ, അഭിഷേകത്തിന് ഉത്തമമാണ്.`);
            } else if (shivaRem === 2) {
                pujaParts.push(`ഇന്ന് ശിവവാസം, ഗൗരീസന്നിധിയിൽ ആണ്. ഇത് സൗഭാഗ്യവും, ഐശ്വര്യവും നൽകുന്നു. അതിനാൽ, അഭിഷേകത്തിന് ഉത്തമമാണ്.`);
            } else if (shivaRem === 3) {
                pujaParts.push(`ഇന്ന് ശിവവാസം, വൃഷഭവാഹനത്തിൽ ആണ്. ഇത്, അഭീഷ്ടസിദ്ധിയും, കാര്യവിജയവും നൽകുന്നു. അതിനാൽ, അഭിഷേകത്തിന് ഉത്തമമാണ്.`);
            }

            // 3. അഗ്നിവാസം (ഹോമങ്ങൾക്ക് ഉത്തമം)
            const isAgniEarth = (((tithiIdx + 1) + weekdayNum + 1) % 4) === 0;
            if (isAgniEarth) {
                pujaParts.push(`ഇന്ന്, അഗ്നിവാസം പൃഥ്വിയിൽ, ആയതിനാൽ, ഹോമങ്ങൾക്ക് ഉത്തമമാണ്.`);
            }

            // 4. മഹാവിഷ്ണു വിശേഷം (ഏകാദശി, ദ്വാദശി, തിരുവോണം നക്ഷത്രം)
            const isVishnuSpecial = (tithiIdx === 10 || tithiIdx === 25 || tithiIdx === 11 || tithiIdx === 26 || nakIdx === 21);
            if (isVishnuSpecial) {
                pujaParts.push(`ഇന്ന്, മഹാവിഷ്ണു പൂജയ്ക്കും, സഹസ്രനാമ ജപത്തിനും, അതിവിശേഷമാണ്.`);
            }

            // 5. ഭഗവതി വിശേഷം (ചൊവ്വ, വെള്ളി, പൗർണ്ണമി, അഷ്ടമി, നവമി, ഭരണി, കാർത്തിക, പൂരം, ഉത്രം)
            const isBhagavathiSpecial = (
                dayIndex === 2 || dayIndex === 5 ||
                tithiIdx === 14 || tithiIdx === 7 || tithiIdx === 22 || tithiIdx === 8 || tithiIdx === 23 ||
                nakIdx === 1 || nakIdx === 2 || nakIdx === 10 || nakIdx === 11
            );
            if (isBhagavathiSpecial) {
                pujaParts.push(`ഇന്ന്, ഭഗവതി പൂജയ്ക്കും, ലളിതാ സഹസ്രനാമ, ജപത്തിനും, അതിവിശേഷമാണ്.`);
            }

            // 6. ഗണപതി വിശേഷം (ചതുർത്ഥി തിഥി)
            if (tithiIdx === 3 || tithiIdx === 18) {
                pujaParts.push(`ഇന്ന്, ഗണപതി പൂജയ്ക്കും, വിഘ്നനിവാരണത്തിനും, അതിവിശേഷമാണ്.`);
            }

            // 7. സുബ്രഹ്മണ്യ വിശേഷം (ഷഷ്ഠി തിഥി, പൂയം നക്ഷത്രം)
            if (tithiIdx === 5 || tithiIdx === 20 || nakIdx === 7) {
                pujaParts.push(`ഇന്ന്, സുബ്രഹ്മണ്യ പൂജയ്ക്കും, വഴിപാടുകൾക്കും, അതിവിശേഷമാണ്.`);
            }

            // 8. ശാസ്താവ് / ശനിദോഷ പരിഹാരം (ശനിയാഴ്ച, ഉത്രം, അനിഴം നക്ഷത്രങ്ങൾ)
            if (dayIndex === 6 || nakIdx === 11 || nakIdx === 16) {
                pujaParts.push(`ഇന്ന്, ശാസ്താ പൂജയ്ക്കും, ശനിദോഷ പരിഹാരത്തിനും, അതിവിശേഷമാണ്.`);
            }

            // 9. നാഗദൈവങ്ങൾ (ആയില്യം നക്ഷത്രം)
            if (nakIdx === 8) {
                pujaParts.push(`ഇന്ന് ആയില്യം, ആയതിനാൽ, നാഗപൂജയ്ക്കും, നൂറും പാലും, സമർപ്പിക്കാനും, ഉത്തമമാണ്.`);
            }

            if (pujaParts.length > 0) {
                pujaVisheshangalText = `ഇന്നത്തെ, പൂജാവിശേഷങ്ങൾ. ${pujaParts.join(" ")}`;
            }

        } else {
            const nakshatraEng = data?.nakshatra?.name || "ലഭ്യമല്ല";
            const nakshatraMal = nakshatraMap[nakshatraEng] || nakshatraEng;
            const tithiEng = data?.tithi?.name || "ലഭ്യമല്ല";
            const tithiMal = tithiMap[tithiEng] || tithiEng;

            const shuklaTithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Poornima"];
            pakshamText = shuklaTithis.includes(tithiEng) ? "വെളുത്ത പക്ഷം." : "കറുത്ത പക്ഷം.";
            tithiDetailText = `തിഥി, ${tithiMal}.`;
            nakshatraDetailText = `ഇന്നത്തെ നക്ഷത്രം, ${nakshatraMal} ആണ്.`;
        }

        // ==========================================
        // 3. സമ്പൂർണ്ണ സോർട്ടിംഗ് & അനൗൺസ്മെൻ്റ് ഘടന
        // ==========================================
        const sections = [
            `${malMonthText} ഇന്നത്തെ, സമ്പൂർണ്ണ പഞ്ചാംഗം. ${rithuText} ${ayanamText} ${njattuvelaText} ${sankrantiText}`,
            `${varaadhipanText} ${sunriseText} ${sunsetText} ${dinamanamText} ${moonriseText} ${moonsetText} ${illuminationText}`,
            `${specialEventText} ${pakshamText} ${tithiDetailText} ${nakshatraDetailText} ${yogaDetailText} ${karanaDetailText}`,
            `${moonRashiText} ${chandrabalamText} ${tarabalamText}`,
            `ഇന്നത്തെ, ശുഭമുഹൂർത്തങ്ങളും, വിശേഷയോഗങ്ങളും. ${brahmaText} ${amritakalamText} ${abhijitText} ${anandadiText} ${pushkaraText}`,
            `ഇന്നത്തെ, ദോഷസമയങ്ങളും, യാത്രാ നിർദ്ദേശങ്ങളും. ${rahuText} ${gulikaText} ${yamaText} ${durmuhurthamText} ${varjyamText} ${gandantaText} ${panchakaText} ${dishaShoolaText}`,
            `${pujaVisheshangalText}`
        ];

        const rawSpeech = sections
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

        const textToSpeak = enforceEsp32ChunkLimit(rawSpeech, 74);

        res.json({ speech: textToSpeak });

    } catch (error: any) {
        console.error("Error fetching Panchangam:", error.message);
        res.status(500).json({ error: "Error occurred" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
