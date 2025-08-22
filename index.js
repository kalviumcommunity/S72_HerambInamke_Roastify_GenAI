import genAI from "./src/config/gemini.js";

async function main() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Give me a funny roast about python snake in 1 line.";

    const result = await model.generateContent(prompt);

    console.log("AI Response:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
