const express = require("express");
const cors = require("cors");
const translate = require("translate-google");

const app = express();
// app.use(cors());


app.use(cors({

  origin: ["https://translator-liard-nine.vercel.app/"],
  methods: ["POST", "GET"],
  credentials: true

}
))


app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;
  try {
    const translatedText = await translate(text, { to: targetLanguage });
   console.log(translatedText);
    res.json({ translatedText: translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
