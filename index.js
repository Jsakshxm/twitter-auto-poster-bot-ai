// By VishwaGauravIn (https://itsvg.in)

const { GoogleGenAI } = require("@google/genai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const generationConfig = {
  maxOutputTokens: 40000,
};
console.log(SECRETS.GEMINI_API_KEY);
console.log(SECRETS.APP_KEY);
console.log(SECRETS.APP_SECRET);
console.log(SECRETS.ACCESS_TOKEN);
console.log(SECRETS.ACCESS_SECRET);
// const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

// async function run() {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-pro",
//     generationConfig,
//   });

//   const prompt =
//     "Write a funny, Hinglish, meme-style tweet for a maths page called Maths Paglu on X. The tweet should be under 280 characters, use Hindi-English mix, be specific and clever, sound human, and include humor, memes, or relatable maths struggles. Optionally add emojis.";

//   try {
//     const result = await model.generateContent(prompt);
//     console.log(result);
//     const response = await result.response;
//     console.log(response);
//     const text = await response.text();
//     console.log(text);

//     console.log("Generated Tweet:", text);

//     if (!text || text.trim().length === 0) {
//       console.error("Gemini returned empty text.");
//       return;
//     }

//     // await sendTweet("Hello");
//   } catch (error) {
//     console.error("Error generating or sending tweet:", error);
//   }
// }

// const ai = new GoogleGenAI({ apiKey: SECRETS.GEMINI_API_KEY });

async function run() {
  const ai = new GoogleGenAI({
    apiKey: SECRETS.GEMINI_API_KEY,
  });
  const tools = [];
  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    tools,
    responseMimeType: "text/plain",
    systemInstruction: [
      {
        text: `You are a helpful assistant that can help with tasks such as writing a tweet. give only one tweet for directly posting on twitter. and that should be short, funny, and engaging`,
      },
    ],
  };
  const model = "gemini-2.5-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Write a funny, Hinglish, meme-style tweet for a maths page called Maths Paglu on X. The tweet should be under 280 characters, use Hindi-English mix, be specific and clever, sound human, and include humor, memes, or relatable maths struggles. Optionally add emojis.
          MathsPaglu is a quirky, chaotic, and relatable maths meme creator who mixes Hinglish, memes, and clever jokes to make maths fun, less scary, and totally scroll-worthy. He’s a math trauma survivor turned content creator, loves turning numbers into punchlines, and subtly promotes the Matiks mental maths app. His content is funny, brainy, and low-key educational, blending Gen Z meme trends with everyday student struggles, and always feels human, casual, and engaging. He’s building a chill community where people laugh, learn, and sometimes flex their IQ, all while making maths feel cool and oddly deep.
          rememeber to be engaging and you could be lil controversial too. NOTE : I dont want "" or unneesaary dash or ** or any other unneesaary characters.
          REMEMBER: Write a short, funny, and slightly controversial Hinglish tweet for "MathsPaglu" that pokes fun at a common maths myth, stereotype, or school system flaw. The tweet should use emojis, Gen Z slang, and a punchy tone to spark debate or playful outrage, while still feeling relatable and human. Keep it under 280 characters and make sure it’s engaging enough to get people talking, sharing, or arguing in the comments.
  `,
        },
      ],
    },
  ];
  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = "";
  for await (const chunk of response) {
    // console.log(chunk.text);
    fileIndex += chunk.text;
  }
  console.log(fileIndex);
  await sendTweet(fileIndex);
}

(async () => {
  await run();
})();

async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
