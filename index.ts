import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const nakshatraMap: { [key: string]: string } = {
    "Ashwini": "അശ്വതി", "Bharani": "ഭരണി", "Krittika": "കാർത്തിക",
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

// സൂര്യ രാശിയെ മലയാളം മാസമാക്കി മാറ്റുന്നു
const malMonthMap: { [key: number]: string } = {
    1: "മേടം", 2: "ഇടവം", 3: "മിഥുനം", 4: "കർക്കടകം", 5: "ചിങ്ങം", 6: "കന്നി",
    7: "തുലാം", 8: "വൃശ്ചികം", 9: "ധനു", 10: "മകരം", 11: "കുംഭം", 12: "മീനം"
};

// സൂര്യ രാശിയെ തമിഴ് മാസമാക്കി മാറ്റുന്നു
const tamMonthMap: { [key: number]: string } = {
    1: "ചിത്തിര", 2: "വൈകാശി", 3: "ആനി", 4: "ആടി", 5: "ആവണി", 6: "പുരട്ടാശി",
    7: "ഐപ്പശി", 8: "കാർത്തിക", 9: "മാർകഴി", 10: "തൈ", 11: "മാശി", 12: "പാൻഗുനി"
};

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
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

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

        const rahuStart = data?.rahu_kalam?.start || "ലഭ്യമല്ല";
        const rahuEnd = data?.rahu_kalam?.end || "ലഭ്യമല്ല";

        let gulikaStart = "ലഭ്യമല്ല", gulikaEnd = "ലഭ്യമല്ല";
        let yamaStart = "ലഭ്യമല്ല", yamaEnd = "ലഭ്യമല്ല";
        let abhijitStart = "ലഭ്യമല്ല", abhijitEnd = "ലഭ്യമല്ല";

        if (data?.sunrise && data?.sunset && data?.weekday?.number) {
            const srMins = timeToMins(data.sunrise);
            const ssMins = timeToMins(data.sunset);
            const dayLength = ssMins - srMins;
            const partLength = dayLength / 8; 
            
            const dayIndex = data.weekday.number - 1; 
            const yamaParts = [5, 4, 3, 2, 1, 7, 6]; 
            const gulikaParts = [7, 6, 5, 4, 3, 2, 1]; 

            const yamaStartMin = srMins + ((yamaParts[dayIndex] - 1) * partLength);
            yamaStart = minsToTime(yamaStartMin);
            yamaEnd = minsToTime(yamaStartMin + partLength);

            const gulikaStartMin = srMins + ((gulikaParts[dayIndex] - 1) * partLength);
            gulikaStart = minsToTime(gulikaStartMin);
            gulikaEnd = minsToTime(gulikaStartMin + partLength);

            const muhurtaLength = dayLength / 15;
            const midday = srMins + (dayLength / 2);
            abhijitStart = minsToTime(midday - (muhurtaLength / 2));
            abhijitEnd = minsToTime(midday + (muhurtaLength / 2));
        }

        // --- കൊല്ലവർഷം, മാസം, തീയതി കണക്കുകൂട്ടുന്നു ---
        const sunSignId = data?.request_time_panchang?.sun_sign?.sign_id;
        const sunDegree = data?.request_time_panchang?.sun_sign?.degree;

        let malMonthText = "";
        if (sunSignId && sunDegree !== undefined) {
            const malMonth = malMonthMap[sunSignId] || "";
            const tamMonth = tamMonthMap[sunSignId] || "";
            // സൂര്യൻ ഒരു ഡിഗ്രി സഞ്ചരിക്കുന്നത് ഏകദേശം ഒരു ദിവസമാണ്
            const solarDate = Math.floor(sunDegree) + 1; 
            
            // ചിങ്ങം മുതൽ കൊല്ലവർഷം മാറുന്നു (ഓഗസ്റ്റ് പകുതിക്ക് ശേഷം)
            let kollaVarsham = year - 825;
            if (month > 8 || (month === 8 && day >= 17)) {
                kollaVarsham = year - 824;
            }

            malMonthText = `കൊല്ലവർഷം ${kollaVarsham}, ${malMonth} മാസം ${solarDate} ആം തീയതി. തമിഴ് മാസം ${tamMonth}. `;
        }

        const rahuText = (rahuStart === "ലഭ്യമല്ല") ? "രാഹുകാലം ലഭ്യമല്ല." : `രാഹുകാലം ${rahuStart} മുതൽ ${rahuEnd} വരെ ആണ്.`;
        const gulikaText = (gulikaStart === "ലഭ്യമല്ല") ? "ഗുളികകാലം ലഭ്യമല്ല." : `ഗുളികകാലം ${gulikaStart} മുതൽ ${gulikaEnd} വരെ ആണ്.`;
        const yamaText = (yamaStart === "ലഭ്യമല്ല") ? "യമഗണ്ഡകാലം ലഭ്യമല്ല." : `യമഗണ്ഡകാലം ${yamaStart} മുതൽ ${yamaEnd} വരെ ആണ്.`;
        const abhijitText = (abhijitStart === "ലഭ്യമല്ല") ? "അഭിജിത്ത് മുഹൂർത്തം ലഭ്യമല്ല." : `അഭിജിത്ത് മുഹൂർത്തം ${abhijitStart} മുതൽ ${abhijitEnd} വരെ ആണ്.`;

        // എല്ലാം ചേർത്ത് ഫൈനൽ വാചകം 
        const textToSpeak = `${malMonthText} ഇന്നത്തെ പൻചാംഗം. തിഥി ${tithiMal}. നക്ഷത്രം ${nakshatraMal} ആണ്. ${rahuText} ${gulikaText} ${yamaText} ${abhijitText}`;

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
