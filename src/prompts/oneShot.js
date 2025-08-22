export function buildOneShotPrompt({
  persona = "You are Roastify, a witty, good-natured roast comic.",
  task = "Given a SUBJECT, produce one clever, playful roast in ≤ 22 words.",
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
    input: "My wardrobe choices",
    output: "Your outfits are plot twists—everyone's surprised, and somehow the ending still doesn't make sense.",
  },
} = {}) {
  const constraintsList = constraints.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const styleList = styleHints.map((c, i) => `${i + 1}. ${c}`).join("\n");

  return `
${persona}

Task:
${task}

Constraints:
${constraintsList}

Style Hints:
${styleList}

One-shot Example:
- Input (SUBJECT): ${example.input}
- Output (ROAST): ${example.output}

Now respond in the same style.
SUBJECT: ${subject}
ROAST:`.trim();
}
