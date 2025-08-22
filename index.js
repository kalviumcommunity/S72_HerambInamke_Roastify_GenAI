import genAI from "./src/config/gemini.js";
import { info, success, error } from "./src/utils/logger.js";
import { zeroShotPrompt } from "./src/prompts/zeroShot.js";
import { measureAsync, extractUsageMetadata, basicCorrectnessCheck } from "./src/utils/metrics.js";
import { buildDynamicPrompt } from "./src/prompts/dynamicPrompt.js";
import { buildMultiShotPrompt } from "./src/prompts/multiShot.js";
import { buildOneShotPrompt } from "./src/prompts/oneShot.js";
import { buildStopSequencePrompt, getStopSequences } from "./src/prompts/stopSequence.js";
import { buildStructuredOutputPrompt, validateStructuredOutput } from "./src/prompts/structured.js";
import { buildSystemUserPrompt, validateRTFCCompliance } from "./src/prompts/systemUser.js";
import { buildTemperaturePrompt, getTemperatureSettings, analyzeTemperatureImpact } from "./src/prompts/temperature.js";

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

async function runOneShotPrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running one-shot prompting...");

    const prompt = buildOneShotPrompt({
      subject: "my budgeting skills",
      constraints: [
        "≤ 20 words",
        "No NSFW or hateful content",
        "Keep it playful"
      ],
      styleHints: [
        "Prefer wordplay",
        "Be concise",
      ],
      example: {
        input: "My time management",
        output: "Your calendar's a plot twist—every plan disappears right before the climax.",
      }
    });

    const { ok, result, error: execError, metrics } = await measureAsync(
      "oneShot-generateContent",
      async () => await model.generateContent(prompt)
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    const correctness = basicCorrectnessCheck(text);
    const usage = extractUsageMetadata(result);

    success("One-Shot Prompt Output:\n" + text);

    info(
      `One-Shot -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );

    info(
      "One-shot prompting provides exactly one example to set style/format before the request, useful when you want light guidance without heavy examples."
    );
  } catch (err) {
    error(`Error running one-shot prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

async function runMultiShotPrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running multi-shot prompting...");

    const prompt = buildMultiShotPrompt({
      subject: "my gym consistency",
      constraints: [
        "≤ 22 words",
        "No NSFW or hateful content",
        "Keep it playful"
      ],
      styleHints: [
        "Prefer metaphors",
        "Clever, not cruel",
      ],
      shots: [
        { input: "My meal prep", output: "Your meal prep is a plot twist—planned on Sunday, missing by Monday." },
        { input: "My small talk", output: "Your small talk is Wi‑Fi at the airport—visible, unstable, and everyone wants to leave." },
        { input: "My sleep schedule", output: "Your sleep schedule is a group project—no one knows who's in charge and the result is chaos." },
      ]
    });

    const { ok, result, error: execError, metrics } = await measureAsync(
      "multiShot-generateContent",
      async () => await model.generateContent(prompt)
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    const correctness = basicCorrectnessCheck(text);
    const usage = extractUsageMetadata(result);

    success("Multi-Shot Prompt Output:\n" + text);

    info(
      `Multi-Shot -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );

    info(
      "Multi-shot prompting supplies several input→output examples to condition the model's style and format before the final query, improving consistency for similar tasks."
    );
  } catch (err) {
    error(`Error running multi-shot prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

async function runStopSequencePrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running stop sequence prompting...");

    const prompt = buildStopSequencePrompt({
      subject: "my social media habits",
      constraints: [
        "≤ 25 words",
        "No NSFW or hateful content",
        "Keep it playful"
      ],
      styleHints: [
        "Prefer wordplay",
        "Be concise",
      ],
      example: {
        input: "My exercise routine",
        output: "Your workout plan is like a mystery novel—everyone knows there's a plot, but no one's seen the action.",
      },
      stopSequences: ["END", "STOP", "FINISH"]
    });

    // Get stop sequences for the API call
    const stopSequences = getStopSequences();
    
    const { ok, result, error: execError, metrics } = await measureAsync(
      "stopSequence-generateContent",
      async () => await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          stopSequences: stopSequences
        }
      })
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    const correctness = basicCorrectnessCheck(text);
    const usage = extractUsageMetadata(result);

    success("Stop Sequence Prompt Output:\n" + text);

    info(
      `Stop Sequence -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );

    info(
      "Stop sequences control where AI responses end by specifying tokens that signal completion, preventing runaway generation and ensuring consistent output length."
    );
  } catch (err) {
    error(`Error running stop sequence prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

async function runStructuredOutputPrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running structured output prompting...");

    const prompt = buildStructuredOutputPrompt({
      subject: "my procrastination habits",
      constraints: [
        "≤ 25 words",
        "No NSFW or hateful content",
        "Keep it playful"
      ],
      styleHints: [
        "Prefer wordplay",
        "Be concise",
      ],
      example: {
        input: "My time management",
        output: {
          roast: "Your calendar's a plot twist—every plan disappears right before the climax.",
          tone: "witty",
          wordCount: 15,
          metaphor: "plot twist",
          category: "time management"
        }
      }
    });

    const { ok, result, error: execError, metrics } = await measureAsync(
      "structuredOutput-generateContent",
      async () => await model.generateContent(prompt)
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    
    // Validate structured output
    const validation = validateStructuredOutput(text);
    const correctness = validation.isValid ? 
      { isLikelyValid: true, reason: validation.reason } : 
      { isLikelyValid: false, reason: validation.reason };
    
    const usage = extractUsageMetadata(result);

    success("Structured Output Prompt Output:\n" + text);
    
    if (validation.isValid) {
      success("Structured Output Validation: SUCCESS");
      success(`Parsed Data: ${JSON.stringify(validation.parsed, null, 2)}`);
    } else {
      error("Structured Output Validation: FAILED");
    }

    info(
      `Structured Output -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );

    info(
      "Structured output ensures consistent, parseable responses by enforcing specific JSON schemas, making AI outputs machine-readable and easier to process programmatically."
    );
  } catch (err) {
    error(`Error running structured output prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

async function runSystemUserPrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running system and user prompting with RTFC framework...");

    const prompt = buildSystemUserPrompt({
      subject: "my organizational skills",
      specificTask: "Generate a witty roast about organization",
      additionalContext: "Focus on desk organization and time management",
      formatPreference: "detailed"
    });

    const { ok, result, error: execError, metrics } = await measureAsync(
      "systemUser-generateContent",
      async () => await model.generateContent(prompt)
    );

    if (!ok) {
      throw execError;
    }

    const text = result.response.text();
    
    // Validate RTFC compliance
    const rtfcValidation = validateRTFCCompliance(text, "organizational skills");
    const correctness = rtfcValidation.isCompliant ? 
      { isLikelyValid: true, reason: rtfcValidation.feedback } : 
      { isLikelyValid: false, reason: rtfcValidation.feedback };
    
    const usage = extractUsageMetadata(result);

    success("System & User Prompt Output:\n" + text);
    
    if (rtfcValidation.isCompliant) {
      success("RTFC Framework Validation: SUCCESS");
      success(`Compliance Score: ${rtfcValidation.score}%`);
      success(`Validation Details: ${JSON.stringify(rtfcValidation.checks, null, 2)}`);
    } else {
      error("RTFC Framework Validation: FAILED");
    }

    info(
      `System & User -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
      `Efficiency: ${metrics.durationMs} ms; ` +
      `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
    );

    info(
      "RTFC Framework (Role, Task, Format, Context) provides structured prompt design that ensures consistent AI behavior, clear expectations, and measurable compliance across all interactions."
    );
  } catch (err) {
    error(`Error running system and user prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

async function runTemperaturePrompting() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    info("Running temperature prompting with different settings...");

    const temperatureSettings = getTemperatureSettings();
    const responses = [];
    const metrics = [];

    for (const tempSetting of temperatureSettings) {
      info(`Testing temperature: ${tempSetting.value} (${tempSetting.name})`);
      
      const prompt = buildTemperaturePrompt({
        subject: "my morning routine",
        temperature: tempSetting.value,
        constraints: [
          "≤ 25 words",
          "No NSFW or hateful content",
          "Keep it playful"
        ],
        styleHints: [
          "Prefer wordplay",
          "Be concise",
        ],
        example: {
          input: "My time management",
          output: "Your calendar's a plot twist—every plan disappears right before the climax.",
        }
      });

      const { ok, result, error: execError, responseMetrics } = await measureAsync(
        `temperature-${tempSetting.value}-generateContent`,
        async () => await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: tempSetting.value
          }
        })
      );

      if (!ok) {
        error(`Error with temperature ${tempSetting.value}: ${execError}`);
        continue;
      }

      const text = result.response.text();
      const correctness = basicCorrectnessCheck(text);
      const usage = extractUsageMetadata(result);

      responses.push(text);
      metrics.push({
        temperature: tempSetting.value,
        name: tempSetting.name,
        response: text,
        correctness,
        usage,
        responseMetrics
      });

      success(`Temperature ${tempSetting.value} Output:\n${text}`);
      
      info(
        `${tempSetting.name} (${tempSetting.value}) -> Correctness: ${correctness.isLikelyValid ? "likely valid" : "possibly invalid"} (${correctness.reason}); ` +
        `Efficiency: ${responseMetrics.durationMs} ms; ` +
        `Scalability(meta): ${usage ? `tokens prompt=${usage.promptTokenCount}, gen=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}` : "n/a"}`
      );
    }

    // Analyze temperature impact across all responses
    const impactAnalysis = analyzeTemperatureImpact(responses.map(r => r.response));
    success("Temperature Impact Analysis:");
    success(impactAnalysis.summary);
    success(`Length Variation: ${impactAnalysis.lengthVariation} words`);
    success(`Metaphor Diversity: ${impactAnalysis.metaphorDiversity} patterns`);
    success(`Tone Consistency: ${impactAnalysis.toneConsistency} variations`);

    info(
      "Temperature controls AI response randomness: lower values (0.1-0.3) produce consistent outputs, while higher values (0.7-0.9) generate more creative and varied responses."
    );
  } catch (err) {
    error(`Error running temperature prompting: ${err?.stack || err?.message || String(err)}`);
  }
}

(async () => {
  await runZeroShot();
  await runDynamicPrompting();
  await runOneShotPrompting();
  await runMultiShotPrompting();
  await runStopSequencePrompting();
  await runStructuredOutputPrompting();
  await runSystemUserPrompting();
  await runTemperaturePrompting();
})();
