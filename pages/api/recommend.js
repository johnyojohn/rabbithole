// /api/recommend.js
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

async function fetchWebsiteContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const content = $("body").text().trim().substring(0, 2048); // Limiting to 2048 characters to fit within GPT-3's limit
    return content;
  } catch (error) {
    console.error("Error fetching website content:", error);
    return "";
  }
}

async function getRecommendations(url) {
  try {
    const websiteContent = await fetchWebsiteContent(url);
    const apiKey = process.env.OPENAI_API_KEY;

    const client = axios.create({
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
    });

    const prompt1 = `Based on the content of the website ${url}, which is:\n${websiteContent}\n\nRecommend three websites that provide more rigorous or comprehensive information:`;
    const maxTokens = 2048;

    const params = {
      prompt: prompt1,
      model: "text-davinci-003",
      max_tokens: maxTokens,
      temperature: 0,
    };

    client
      .post("https://api.openai.com/v1/completions", params)
      .then((result) => {
        console.log(result.data.choices[0].text.trim().split("\n"));
        const recs = result.data.choices[0].text.trim().split("\n");
        return recs;
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    const response = await client.post(
      "https://api.openai.com/v1/completions",
      params
    );
    const Recs = response.data.choices[0].text.trim().split("\n");
    // Debug: Log the URL and API Key
    console.log("API Key:", apiKey);
    return Recs;
  } catch (error) {
    console.error("Error in getRecommendations:", error);

    // Debug: Log the full Axios error
    if (error.response) {
      console.error("Axios Error Response:", error.response);
    }

    return [];
  }
}

export default async (req, res) => {
  if (req.method === "POST") {
    const url = req.body.url;
    const recommendations = await getRecommendations(url);
    res.json({ recommendations });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
