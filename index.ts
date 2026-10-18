import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// നക്ഷത്രങ്ങളെ മലയാളത്തിലേക്ക് മാറ്റാനുള്ള മാപ്പിംഗ്
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

// തിഥിയെ മലയാളത്തിലേക്ക് മാറ്റാനുള്ള മാപ്പിംഗ്
const tithiMap: { [key: string]: string } = {
    "Pratipada": "പ്രഥമ", "Dwitiya": "ദ്വിതീയ", "Tritiya": "തൃതീയ",
    "Chaturthi": "ചതുർത്ഥി", "Panchami": "പഞ്ചമി", "Shashthi": "ഷഷ്ഠി",
    "Saptami": "സപ്തമി", "Ashtami": "അഷ്ടമി", "Navami": "നവമി",
    "Dashami": "ദശമി", "Ekadashi": "ഏകാദശി", "Dwadashi": "ദ്വാദശി",
    "Trayodashi": "ത്രയോദശി", "Chaturdashi": "ചതുർദ്ദശി",
    "Purnima": "പൗർണ്ണമി", "Amavasya": "അമാവാസി"
};

// സമയത്തെ ഗണിതക്രിയകൾക്കായി മിനിറ്റിലേക്ക് മാറ്റുന്ന ഫംഗ്ഷൻ
function timeToMins(t: string): number {
    if (!t) return 0;
    const parts = t.split(':').map(Number);
    return (parts[0] * 60) + parts[1];
}

// മിനിറ്റിനെ തിരികെ മണിക്കൂർ:മിനിറ്റ് (HH:MM) ഫോർമാറ്റിലേക്ക് മാറ്റുന്ന ഫംഗ്ഷൻ
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

        // FreeAstroAPI-ൽ നിന്നും ഡാറ്റ എടുക്കുന്നു
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

        // 1. നക്ഷത്രം
        const nakshatraEng = data?.nakshatra?.name || "ലഭ്യമല്ല";
        const nakshatraMal = nakshatraMap[nakshatraEng] || nakshatraEng;

        // 2. തിഥി
        const tithiEng = data?.tithi?.name || "ലഭ്യമല്ല";
        const tithiMal = tithiMap[tithiEng] || tithiEng;

        // 3. രാഹുകാലം (API നേരിട്ട് നൽകുന്നത്)
        const rahuStart = data?.rahu_kalam?.start || "ലഭ്യമല്ല";
        const rahuEnd = data?.rahu_kalam?.end || "ലഭ്യമല്ല";

        // ബാക്കി സമയങ്ങൾക്കുള്ള ഡീഫോൾട്ട് വാല്യൂ
        let gulikaStart = "ലഭ്യമല്ല", gulikaEnd = "ലഭ്യമല്ല";
        let yamaStart = "ലഭ്യമല്ല", yamaEnd = "ലഭ്യമല്ല";
        let abhijitStart = "ലഭ്യമല്ല", abhijitEnd = "ലഭ്യമല്ല";

        // 4. വേദഗണിതം ഉപയോഗിച്ച് സമയങ്ങൾ സ്വയം കണക്കുകൂട്ടുന്നു
        if (data?.sunrise && data?.sunset && data?.weekday?.number) {
            const srMins = timeToMins(data.sunrise); // സൂര്യോദയം മിനിറ്റിൽ
            const ssMins = timeToMins(data.sunset);  // സൂര്യാസ്തമയം മിനിറ്റിൽ
            const dayLength = ssMins - srMins;       // പകലിന്റെ ആകെ ദൈർഘ്യം
            const partLength = dayLength / 8;        // പകലിനെ 8 തുല്യ ഭാഗങ്ങളാക്കുന്നു
            
            // ദിവസത്തിന്റെ ഇൻഡക്സ് (1 = ഞായർ ആയതുകൊണ്ട്, അതിനെ 0 മുതൽ 6 വരെയുള്ള ഇൻഡക്സ് ആക്കുന്നു)
            const dayIndex = data.weekday.number - 1; 

            // യമഗണ്ഡം, ഗുളികം എന്നിവയുടെ യഥാർത്ഥ വേദഗണിത ക്രമം (ഞായർ മുതൽ ശനി വരെ)
            const yamaParts = [5, 4, 3, 2, 1, 7, 6]; 
            const gulikaParts = [7, 6, 5, 4, 3, 2, 1]; // തെറ്റുതിരുത്തിയ കൃത്യമായ ഗുളിക ക്രമം

            // യമഗണ്ഡകാലം കണക്കുകൂട്ടുന്നു
            const yamaStartMin = srMins + ((yamaParts[dayIndex] - 1) * partLength);
            yamaStart = minsToTime(yamaStartMin);
            yamaEnd = minsToTime(yamaStartMin + partLength);

            // ഗുളികകാലം കണക്കുകൂട്ടുന്നു
            const gulikaStartMin = srMins + ((gulikaParts[dayIndex] - 1) * partLength);
            gulikaStart = minsToTime(gulikaStartMin);
            gulikaEnd = minsToTime(gulikaStartMin + partLength);

            // അഭിജിത്ത് മുഹൂർത്തം കണക്കുകൂട്ടുന്നു (പകലിന്റെ ദൈർഘ്യത്തിന്റെ 15-ൽ 1 ഭാഗം)
            const muhurtaLength = dayLength / 15;
            const midday = srMins + (dayLength / 2); // ഉച്ചസമയം
            abhijitStart = minsToTime(midday - (muhurtaLength / 2));
            abhijitEnd = minsToTime(midday + (muhurtaLength / 2));
        }

        // വാചകങ്ങൾ തയ്യാറാക്കുന്നു
        const rahuText = (rahuStart === "ലഭ്യമല്ല") ? "രാഹുകാലം ലഭ്യമല്ല." : `രാഹുകാലം ${rahuStart} മുതൽ ${rahuEnd} വരെ ആണ്.`;
        const gulikaText = (gulikaStart === "ലഭ്യമല്ല") ? "ഗുളികകാലം ലഭ്യമല്ല." : `ഗുളികകാലം ${gulikaStart} മുതൽ ${gulikaEnd} വരെ ആണ്.`;
        const yamaText = (yamaStart === "ലഭ്യമല്ല") ? "യമഗണ്ഡകാലം ലഭ്യമല്ല." : `യമഗണ്ഡകാലം ${yamaStart} മുതൽ ${yamaEnd} വരെ ആണ്.`;
        const abhijitText = (abhijitStart === "ലഭ്യമല്ല") ? "അഭിജിത്ത് മുഹൂർത്തം ലഭ്യമല്ല." : `അഭിജിത്ത് മുഹൂർത്തം ${abhijitStart} മുതൽ ${abhijitEnd} വരെ ആണ്.`;

        // ഗൂഗിൾ TTS ഉച്ചാരണം കൃത്യമാക്കാൻ 'പൻചാംഗം' എന്ന് നൽകി ഫൈനൽ വാചകം ഉണ്ടാക്കുന്നു
        const textToSpeak = `ഇന്നത്തെ പൻചാംഗം. തിഥി ${tithiMal}. നക്ഷത്രം ${nakshatraMal} ആണ്. ${rahuText} ${gulikaText} ${yamaText} ${abhijitText}`;

        // ESP32-യിലേക്ക് റിസൾട്ട് അയക്കുന്നു
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
