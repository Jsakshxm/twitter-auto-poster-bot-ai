// By VishwaGauravIn (https://itsvg.in)

const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const generationConfig = {
  maxOutputTokens: 400,
};
console.log(SECRETS.GEMINI_API_KEY);
console.log(SECRETS.APP_KEY);
console.log(SECRETS.APP_SECRET);
console.log(SECRETS.ACCESS_TOKEN);
console.log(SECRETS.ACCESS_SECRET);
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    generationConfig,
  });

  // Write your prompt here
  const prompt =
    "Write a funny, Hinglish, meme-style tweet for a maths page called Maths Paglu on X. The tweet should be under 280 characters, use Hindi-English mix, be specific and clever, sound human, and include humor, memes, or relatable maths struggles. Optionally add emojis.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  sendTweet(text);
}

run();

async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
