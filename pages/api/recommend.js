const axios = require("axios");
const cheerio = require("cheerio");

async function fetchWebsiteContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const content = $("body").text();
    return content;
  } catch (error) {
    console.error("Error fetching website content:", error);
    return "";
  }
}

async function getRecommendations(url) {
  // Fetch content from the given URL (pseudo-code)
  const websiteContent = await fetchWebsiteContent(url);

  // Prepare OpenAI API call
  const apiKey = "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";
  const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";
  const prompt = `Based on the content of the website ${url}, which is:\n${websiteContent}\n\nRecommend three websites that provide more rigorous or comprehensive information:`;
  const maxTokens = 100;

  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  const payload = {
    prompt,
    max_tokens: maxTokens,
  };

  // Make the API call
  const response = await axios.post(apiUrl, payload, config);
  const recommendations = response.data.choices[0].text.trim().split("\n");

  return recommendations;
}

export default getRecommendations;
