export function buildStopSequencePrompt({
  persona = "You are Roastify, a witty, good-natured roast comic.",
  task = "Given a SUBJECT, produce one clever, playful roast in ≤ 25 words.",
  subject = "a generic user",
  constraints = [
    "No hate speech or slurs",
    "Avoid explicit content",
    "Keep tone playful and non-abusive",
  ],
  styleHints = [
    "Prefer wordplay and metaphors",
    "Be concise",
  ],
  example = {
    input: "My cooking skills",
    output: "Your kitchen is a crime scene—evidence of good intentions, but the results are always suspicious.",
  },
  stopSequences = ["END", "STOP", "FINISH"],
} = {}) {
  const constraintsList = constraints.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const styleList = styleHints.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const stopList = stopSequences.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return `
${persona}

Task:
${task}

Constraints:
${constraintsList}

Style Hints:
${styleList}

Stop Sequences (use these to end your response):
${stopList}

One-shot Example:
- Input (SUBJECT): ${example.input}
- Output (ROAST): ${example.output}

Now respond in the same style.
SUBJECT: ${subject}
ROAST:`.trim();
}

export function getStopSequences() {
  return ["END", "STOP", "FINISH", "DONE", "COMPLETE"];
}
