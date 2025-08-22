import genAI from "./src/config/gemini.js";
import { info, success, error } from "./src/utils/logger.js";
import { zeroShotPrompt } from "./src/prompts/zeroShot.js";
import { measureAsync, extractUsageMetadata, basicCorrectnessCheck } from "./src/utils/metrics.js";

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

runZeroShot();
