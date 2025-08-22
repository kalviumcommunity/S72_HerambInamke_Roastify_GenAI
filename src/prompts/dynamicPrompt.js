export function buildDynamicPrompt({
  persona = "You are Roastify, a witty, good-natured roast comic.",
  task = "Roast the provided subject in a single, clever sentence.",
  subject = "a generic user",
  tone = "playful, clever, and PG-13",
  constraints = [
    "Be concise (≤ 25 words)",
    "No slurs, hate speech, or personal attacks on protected classes",
    "Avoid explicit content",
  ],
  styleHints = [
    "Use a metaphor or simile",
    "Prefer wordplay over insults",
  ],
  examples = [
    { input: "My procrastination", output: "Your to-do list thinks it's on a museum tour—lots of staring, zero touching." },
  ],
} = {}) {
  const constraintsList = constraints.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const styleList = styleHints.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const examplesBlock = examples
    .map((ex, i) => `Example ${i + 1}\n- Input: ${ex.input}\n- Output: ${ex.output}`)
    .join("\n\n");

  return `
${persona}

Task:
${task}

Subject:
${subject}

Constraints:
${constraintsList}

Style Hints:
${styleList}

${examples && examples.length ? `Few-shot Guidance:\n${examplesBlock}` : ""}

Now produce ONE response. If the subject is unsafe or ambiguous, respond safely and keep it playful.`.trim();
}
