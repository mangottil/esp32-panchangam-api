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

        // 1. നക്ഷത്രം എടുക്കുന്നു
        const nakshatraEng = data?.nakshatra?.name || "ലഭ്യമല്ല";
        const nakshatraMal = nakshatraMap[nakshatraEng] || nakshatraEng;

        // 2. ഊഹങ്ങളില്ലാതെ, API-യുടെ കൃത്യമായ പേരുകളിൽ നിന്ന് സമയങ്ങൾ എടുക്കുന്നു
        const rahuStart = data?.rahu_kala?.start || "ലഭ്യമല്ല";
        const rahuEnd = data?.rahu_kala?.end || "ലഭ്യമല്ല";

        const gulikaStart = data?.gulika_kala?.start || "ലഭ്യമല്ല";
        const gulikaEnd = data?.gulika_kala?.end || "ലഭ്യമല്ല";

        const yamaStart = data?.yamaganda_kala?.start || "ലഭ്യമല്ല";
        const yamaEnd = data?.yamaganda_kala?.end || "ലഭ്യമല്ല";

        const abhijitStart = data?.abhijit_muhurta?.start || "ലഭ്യമല്ല";
        const abhijitEnd = data?.abhijit_muhurta?.end || "ലഭ്യമല്ല";

        // 3. മലയാളം വാചകങ്ങൾ തയ്യാറാക്കുന്നു (തുടങ്ങുന്ന സമയവും അവസാനിക്കുന്ന സമയവും)
        const rahuText = (rahuStart === "ലഭ്യമല്ല" || rahuEnd === "ലഭ്യമല്ല") 
            ? "രാഹുകാലം ലഭ്യമല്ല." 
            : `രാഹുകാലം ${rahuStart} മുതൽ ${rahuEnd} വരെ ആണ്.`;

        const gulikaText = (gulikaStart === "ലഭ്യമല്ല" || gulikaEnd === "ലഭ്യമല്ല") 
            ? "ഗുളികകാലം ലഭ്യമല്ല." 
            : `ഗുളികകാലം ${gulikaStart} മുതൽ ${gulikaEnd} വരെ ആണ്.`;

        const yamaText = (yamaStart === "ലഭ്യമല്ല" || yamaEnd === "ലഭ്യമല്ല") 
            ? "യമഗണ്ഡകാലം ലഭ്യമല്ല." 
            : `യമഗണ്ഡകാലം ${yamaStart} മുതൽ ${yamaEnd} വരെ ആണ്.`;

        const abhijitText = (abhijitStart === "ലഭ്യമല്ല" || abhijitEnd === "ലഭ്യമല്ല") 
            ? "അഭിജിത്ത് മുഹൂർത്തം ലഭ്യമല്ല." 
            : `അഭിജിത്ത് മുഹൂർത്തം ${abhijitStart} മുതൽ ${abhijitEnd} വരെ ആണ്.`;

        // 4. എല്ലാം ചേർത്ത് ഫൈനൽ വാചകം തയ്യാറാക്കുന്നു
        const textToSpeak = `ഇന്നത്തെ പൻചാംഗം. നക്ഷത്രം ${nakshatraMal} ആണ്. ${rahuText} ${gulikaText} ${yamaText} ${abhijitText}`;

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
