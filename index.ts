import express, { Request, Response } from 'express';
import axios from 'axios';
import * as googleTTS from 'google-tts-api';

const app = express();
app.use(express.json());

app.get('/api/panchangam', async (req: Request, res: Response) => {
    try {
        // ഇന്നത്തെ തീയതി എടുക്കുന്നു
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // FreeAstroAPI വഴി തിരൂരിലെ വിവരങ്ങൾ എടുക്കുന്നു
        const astroResponse = await axios.post("https://api.freeastroapi.com/api/v2/vedic/panchang", {
            year: year,
            month: month,
            day: day,
            hour: 6,
            minute: 0,
            city: "Tirur",
            lat: 10.9156,
            lng: 75.9236,
            tz_str: "Asia/Kolkata"
        }, {
            headers: { 
                "Content-Type": "application/json",
                // Render-ൽ ASTRO_API_KEY എന്ന് നൽകണം
                "x-api-key": process.env.ASTRO_API_KEY 
            }
        });

        const data = astroResponse.data;

        // ലഭിച്ച വിവരങ്ങൾ വെച്ച് മലയാളത്തിൽ വാചകം ഉണ്ടാക്കുന്നു
        const textToSpeak = `ഇന്നത്തെ നക്ഷത്രം ${data.nakshatra.name} ആണ്. രാഹുകാലം ${data.rahu_kalam.start} മുതൽ ${data.rahu_kalam.end} വരെ ആണ്. ഗുളികകാലം ${data.gulika_kalam.start} മുതൽ ${data.gulika_kalam.end} വരെ ആണ്.`;

        // Google TTS വഴി വാചകത്തെ ഓഡിയോ ആക്കി മാറ്റുന്നു
        const audioUrl = googleTTS.getAudioUrl(textToSpeak, {
            lang: 'ml', // മലയാളം
            slow: false,
            host: 'https://translate.google.com',
        });

        // ഓഡിയോ ലിങ്ക് പ്ലെയിൻ ടെക്സ്റ്റ് ആയി നൽകുന്നു
        res.type('text/plain').send(audioUrl);

    } catch (error: any) {
        console.error("Error fetching Panchangam:", error.message);
        res.status(500).send("Error occurred");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});