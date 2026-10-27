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

const tithiMap: { [key: string]: string } = {
    "Pratipada": "പ്രഥമ", "Dwitiya": "ദ്വിതീയ", "Tritiya": "തൃതീയ",
    "Chaturthi": "ചതുർത്ഥി", "Panchami": "പഞ്ചമി", "Shashthi": "ഷഷ്ഠി",
    "Saptami": "സപ്തമി", "Ashtami": "അഷ്ടമി", "Navami": "നവമി",
    "Dashami": "ദശമി", "Ekadashi": "ഏകാദശി", "Dwadashi": "ദ്വാദശി",
    "Trayodashi": "ത്രയോദശി", "Chaturdashi": "ചതുർദ്ദശി",
    "Purnima": "പൗർണ്ണമി", "Amavasya": "അമാവാസി"
};

const rasiMap: { [key: string]: string } = {
    "Aries": "മേടം", "Taurus": "ഇടവം", "Gemini": "മിഥുനം", "Cancer": "കർക്കടകം",
    "Leo": "ചിങ്ങം", "Virgo": "കന്നി", "Libra": "തുലാം", "Scorpio": "വൃശ്ചികം",
    "Sagittarius": "ധനു", "Capricorn": "മകരം", "Aquarius": "കുംഭം", "Pisces": "മീനം"
};

const malMonthMap: { [key: number]: string } = {
    1: "മേടം", 2: "ഇടവം", 3: "മിഥുനം", 4: "കർക്കടകം", 5: "ചിങ്ങം", 6: "കന്നി",
    7: "തുലാം", 8: "വൃശ്ചികം", 9: "ധനു", 10: "മകരം", 11: "കുംഭം", 12: "മീനം"
};

const tamMonthMap: { [key: number]: string } = {
    1: "ചിത്തിര", 2: "വൈകാശി", 3: "ആനി", 4: "ആടി", 5: "ആവണി", 6: "പുരട്ടാശി",
    7: "ഐപ്പശി", 8: "കാർത്തിക", 9: "മാർകഴി", 10: "തൈ", 11: "മാശി", 12: "പാൻഗുനി"
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

const numToMal: { [key: number]: string } = {
    0: "പൂജ്യം", 1: "ഒന്ന്", 2: "രണ്ട്", 3: "മൂന്ന്", 4: "നാല്", 5: "അഞ്ച്",
    6: "ആറ്", 7: "ഏഴ്", 8: "എട്ട്", 9: "ഒൻപത്", 10: "പത്ത്",
    11: "പതിനൊന്ന്", 12: "പന്ത്രണ്ട്", 13: "പതിമൂന്ന്", 14: "പതിനാല്", 15: "പതിനഞ്ച്",
    16: "പതിനാറ്", 17: "പതിനേഴ്", 18: "പതിനെട്ട്", 19: "പത്തൊൻപത്", 20: "ഇരുപത്",
    30: "മുപ്പത്", 40: "നാൽപത്", 50: "അമ്പത്"
};

function numberToMalayalam(n: number): string {
    if (numToMal[n]) return numToMal[n];
    if (n > 20 && n < 60) {
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

function timeToMins(t: string): number {
    if (!t) return 0;
    const parts = t.split(':').map(Number);
    return (parts[0] * 60) + parts[1];
}

function minsToTime(m: number): string {
    const h = Math.floor(m / 60);
    const mins = Math.floor(m % 60);
    return `${String(h).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
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
        
        let year = 2026, month = 10, day = 19;
        for (const p of parts) {
            if (p.type === 'year') year = parseInt(p.value);
            if (p.type === 'month') month = parseInt(p.value);
            if (p.type === 'day') day = parseInt(p.value);
        }

        const astroResponse = await axios.post("https://api.freeastroapi.com/api/v2/vedic/panchang", {
            year: year, month: month, day: day,
            hour: 6, minute: 0, city: "Tirur",
            lat: 10.9156, lng: 75.9236, tz_str: "Asia/Kolkata"
        }, {
            headers: { 
                "Content-Type": "application/json",
                "x-api-key": process.env.ASTRO_API_KEY 
            }
        });

        const data = astroResponse.data;

        const nakshatraEng = data?.nakshatra?.name || "ലഭ്യമല്ല";
        const nakshatraMal = nakshatraMap[nakshatraEng] || nakshatraEng;

        const tithiEng = data?.tithi?.name || "ലഭ്യമല്ല";
        const tithiMal = tithiMap[tithiEng] || tithiEng;

        // അഡീഷണൽ വിശേഷങ്ങൾ (ചുരുങ്ങിയ വാക്കുകളിൽ)
        let specialEventText = "";
        if (tithiEng === "Purnima") specialEventText = "ഇന്ന് പൗർണ്ണമി.";
        else if (tithiEng === "Amavasya") specialEventText = "ഇന്ന് അമാവാസി.";
        else if (tithiEng === "Ekadashi") specialEventText = "ഇന്ന് ഏകാദശി.";
        else if (tithiEng === "Trayodashi") specialEventText = "ഇന്ന് പ്രദോഷം.";
        else if (tithiEng === "Chaturthi") specialEventText = "ഇന്ന് ചതുർത്ഥി.";
        else if (tithiEng === "Shashthi") specialEventText = "ഇന്ന് ഷഷ്ഠി.";
        else if (tithiEng === "Ashtami") specialEventText = "ഇന്ന് അഷ്ടമി.";

        const shuklaTithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"];
        const pakshamText = shuklaTithis.includes(tithiEng) ? "വെളുത്ത പക്ഷം." : "കറുത്ത പക്ഷം.";

        const weekdayNum = data?.weekday?.number || 1;
        const varaadhipanName = varaadhipanMap[weekdayNum] || "";
        const varaadhipanText = varaadhipanName ? `ഇന്നത്തെ വാരാധിപൻ, ${varaadhipanName}, ആണ്.` : "";

        // അഡീഷണൽ ചന്ദ്രരാശി വിവരം
        const moonSignEng = data?.chandra_rasi?.name || data?.moon_sign?.name || "";
        const moonSignMal = rasiMap[moonSignEng] || "";
        const moonSignText = moonSignMal ? `ചന്ദ്രരാശി ${moonSignMal}.` : "";

        let gulikaStartRaw = "", gulikaEndRaw = "";
        let yamaStartRaw = "", yamaEndRaw = "";
        let abhijitStartRaw = "", abhijitEndRaw = "";
        let durmuhurthamStartRaw = "", durmuhurthamEndRaw = "";

        if (data?.sunrise && data?.sunset && data?.weekday?.number) {
            const srMins = timeToMins(data.sunrise);
            const ssMins = timeToMins(data.sunset);
            const dayLength = ssMins - srMins;
            const partLength = dayLength / 8; 
            
            const dayIndex = data.weekday.number - 1; 
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
            njattuvelaText = `ഇന്നത്തെ ഞാറ്റുവേല, ${njattuvelaName} ഞാറ്റുവേലയാണ്.`;

            const rithuName = rithuMap[sunSignId] || "വസന്ത ഋതു";
            rithuText = `ഇന്നത്തെ ഋതു, ${rithuName}, ആണ്.`;
        }

        const srMins = timeToMins(data?.sunrise);
        const brahmaStartRaw = minsToTime(srMins - 96 < 0 ? srMins - 96 + 1440 : srMins - 96);
        const brahmaEndRaw = minsToTime(srMins - 48 < 0 ? srMins - 48 + 1440 : srMins - 48);

        const rahuStartRaw = data?.rahu_kalam?.start || "";
        const rahuEndRaw = data?.rahu_kalam?.end || "";
        const sunriseRaw = data?.sunrise || "";
        const sunsetRaw = data?.sunset || "";

        const brahmaText = (brahmaStartRaw === "ലഭ്യമല്ല") ? "" : `ഇന്നത്തെ ബ്രാഹ്മ മുഹൂർത്തം, പുലർച്ചെ നാല് മണി, മുതൽ, രാവിലെ അഞ്ച് മണി വരെ ആണ്.`;
        const rahuText = !rahuStartRaw ? "രാഹുകാലം ലഭ്യമല്ല." : `രാഹുകാലം, ${formatTimeSpoken(rahuStartRaw)}, മുതൽ, ${formatTimeSpoken(rahuEndRaw)}, വരെ ആണ്.`;
        const gulikaText = !gulikaStartRaw ? "ഗുളികകാലം ലഭ്യമല്ല." : `ഗുളികകാലം, ${formatTimeSpoken(gulikaStartRaw)}, മുതൽ, ${formatTimeSpoken(gulikaEndRaw)}, വരെ ആണ്.`;
        const yamaText = !yamaStartRaw ? "യമഗണ്ഡകാലം ലഭ്യമല്ല." : `യമഗണ്ഡകാലം, ${formatTimeSpoken(yamaStartRaw)}, മുതൽ, ${formatTimeSpoken(yamaEndRaw)}, വരെ ആണ്.`;
        const durmuhurthamText = !durmuhurthamStartRaw ? "ദുർമുഹൂർത്തം ലഭ്യമല്ല." : `ദുർമുഹൂർത്തം, ${formatTimeSpoken(durmuhurthamStartRaw)}, മുതൽ, ${formatTimeSpoken(durmuhurthamEndRaw)}, വരെ ആണ്.`;
        const abhijitText = !abhijitStartRaw ? "അഭിജിത്ത് മുഹൂർത്തം ലഭ്യമല്ല." : `അഭിജിത്ത് മുഹൂർത്തം, ${formatTimeSpoken(abhijitStartRaw)}, മുതൽ, ${formatTimeSpoken(abhijitEndRaw)}, വരെ ആണ്.`;
        
        const sunriseText = !sunriseRaw ? "സൂര്യോദയം ലഭ്യമല്ല." : `ഇന്നത്തെ സൂര്യോദയം, ${formatTimeSpoken(sunriseRaw)}, ആണ്.`;
        const sunsetText = !sunsetRaw ? "സൂര്യാസ്തമയം ലഭ്യമല്ല." : `ഇന്നത്തെ സൂര്യാസ്തമയം, ${formatTimeSpoken(sunsetRaw)}, ആണ്.`;

        // നിലവിലുള്ള കോഡിന്റെ ഘടന നിലനിർത്തിക്കൊണ്ട് പുതിയ വിവരങ്ങൾ കൃത്യമായി കോർത്തിരിക്കുന്നു
        const textToSpeak = `${malMonthText} ഇന്നത്തെ പഞ്ചാംഗം. ${specialEventText} ${pakshamText} തിഥി, ${tithiMal}. ഇന്നത്തെ നക്ഷത്രം, ${nakshatraMal} ആണ്. ${moonSignText} ${varaadhipanText} ${rithuText} ${njattuvelaText} ${brahmaText} ${rahuText} ${gulikaText} ${yamaText} ${durmuhurthamText} ${abhijitText} ${sunriseText} ${sunsetText}`;

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
