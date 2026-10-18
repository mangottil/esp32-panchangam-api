import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.get('/api/panchangam', async (req: Request, res: Response) => {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

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
                "x-api-key": process.env.ASTRO_API_KEY 
            }
        });

        const data = astroResponse.data;
        
        // യഥാർത്ഥ ഡാറ്റ എന്താണെന്ന് ലോഗിൽ കാണാൻ
        console.log("Panchangam Data:", JSON.stringify(data));

        // സെർവർ ക്രാഷ് ആവാതിരിക്കാനുള്ള സുരക്ഷാ കോഡ്
        const nakshatra = data?.nakshatra?.name || "ലഭ്യമല്ല";
        const rahuStart = data?.rahu_kalam?.start || data?.rahukalam?.start || data?.rahu_kala?.start || "ലഭ്യമല്ല";
        const rahuEnd = data?.rahu_kalam?.end || data?.rahukalam?.end || data?.rahu_kala?.end || "ലഭ്യമല്ല";
        const gulikaStart = data?.gulika_kalam?.start || data?.gulikakalam?.start || data?.gulika_kala?.start || "ലഭ്യമല്ല";
        const gulikaEnd = data?.gulika_kalam?.end || data?.gulikakalam?.end || data?.gulika_kala?.end || "ലഭ്യമല്ല";

        const textToSpeak = `ഇന്നത്തെ നക്ഷത്രം ${nakshatra} ആണ്. രാഹുകാലം ${rahuStart} മുതൽ ${rahuEnd} വരെ ആണ്. ഗുളികകാലം ${gulikaStart} മുതൽ ${gulikaEnd} വരെ ആണ്.`;

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
