import genAI from "./src/config/gemini.js";
import { info, success, error } from "./src/utils/logger.js";
import { zeroShotPrompt } from "./src/prompts/zeroShot.js";
import { measureAsync, extractUsageMetadata, basicCorrectnessCheck } from "./src/utils/metrics.js";
import { buildDynamicPrompt } from "./src/prompts/dynamicPrompt.js";

async function runZeroShot() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running zero-shot prompt...");

    const { ok, result, error: execError, metrics } = await measureAsync(
      "zeroShot-generateContent",
      async () => await model.generateContent(zeroShotPrompt)
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    const correctness = basicCorrectnessCheck(text);
    const usage = extractUsageMetadata(result);

    success("Zero-Shot Prompt Output:\n" + text);

    // Minimal evaluation summary
    info(
      `Evaluation -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );
  } catch (err) {
    error(`Error running zero-shot prompt: ${err?.stack || err?.message || String(err)}`);
  }
}

async function runDynamicPrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running dynamic prompting...");

    const prompt = buildDynamicPrompt({
      subject: "my coffee addiction",
      tone: "witty but kind",
      constraints: [
        "Be concise (≤ 20 words)",
        "No NSFW or hateful content",
        "Keep it playful"
      ],
      styleHints: [
        "Prefer wordplay",
        "Avoid direct insults",
      ],
      examples: [
        { input: "My messy desk", output: "Your desk is a collage titled 'Where motivation goes to hide and snacks go to die.'" }
      ]
    });

    const { ok, result, error: execError, metrics } = await measureAsync(
      "dynamicPrompt-generateContent",
      async () => await model.generateContent(prompt)
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    const correctness = basicCorrectnessCheck(text);
    const usage = extractUsageMetadata(result);

    success("Dynamic Prompt Output:\n" + text);

    // Minimal evaluation summary aligned to rubric
    info(
      `Dynamic -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );

    // Brief explanation for the video/console
    info(
      "Dynamic prompting assembles the instruction at runtime from persona, task, subject, constraints, style hints, and few-shot examples. " +
      "This lets us tailor outputs per request while keeping safety and style consistent."
    );
  } catch (err) {
    error(`Error running dynamic prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

(async () => {
  await runZeroShot();
  await runDynamicPrompting();
})();
