export function buildTemperaturePrompt({
  persona = "You are Roastify, a witty, good-natured roast comic.",
  task = "Given a SUBJECT, produce one clever, playful roast.",
  subject = "a generic user",
  temperature = 0.7,
  constraints = [
    "No hate speech or slurs",
    "Avoid explicit content",
    "Keep tone playful and non-abusive",
  ],
  styleHints = [
    "Prefer wordplay and metaphors",
    "Be concise (≤ 25 words)",
  ],
  example = {
    input: "My cooking skills",
    output: "Your kitchen is a crime scene—evidence of good intentions, but the results are always suspicious.",
  },
} = {}) {
  const constraintsList = constraints.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const styleList = styleHints.map((c, i) => `${i + 1}. ${c}`).join("\n");

  const temperatureDescription = getTemperatureDescription(temperature);

  return `
${persona}

Task:
${task}

Temperature Setting: ${temperature} (${temperatureDescription})

Constraints:
${constraintsList}

Style Hints:
${styleList}

Example:
- Input (SUBJECT): ${example.input}
- Output (ROAST): ${example.output}

Now respond in the same style with temperature ${temperature}.
SUBJECT: ${subject}
ROAST:`.trim();
}

export function getTemperatureDescription(temp) {
  if (temp <= 0.1) return "Very Low - Highly focused and deterministic";
  if (temp <= 0.3) return "Low - Consistent and predictable";
  if (temp <= 0.5) return "Medium - Balanced creativity and consistency";
  if (temp <= 0.7) return "Medium-High - Creative with some variety";
  if (temp <= 0.9) return "High - Very creative and diverse";
  return "Very High - Maximum creativity and randomness";
}

export function getTemperatureSettings() {
  return [
    { value: 0.1, name: "Very Low", description: "Highly focused, deterministic responses" },
    { value: 0.3, name: "Low", description: "Consistent, predictable outputs" },
    { value: 0.5, name: "Medium", description: "Balanced creativity and consistency" },
    { value: 0.7, name: "Medium-High", description: "Creative with moderate variety" },
    { value: 0.9, name: "High", description: "Very creative and diverse" }
  ];
}

export function analyzeTemperatureImpact(responses) {
  if (!responses || responses.length < 2) {
    return { message: "Need at least 2 responses to analyze temperature impact" };
  }

  const analysis = {
    creativityVariation: responses.length,
    averageLength: 0,
    lengthVariation: 0,
    metaphorDiversity: new Set(),
    toneConsistency: new Set()
  };

  let totalLength = 0;
  responses.forEach(response => {
    const words = response.split(/\s+/).length;
    totalLength += words;
    analysis.metaphorDiversity.add(response.toLowerCase().includes('like') || response.toLowerCase().includes('as'));
    analysis.toneConsistency.add(response.toLowerCase().includes('witty') || response.toLowerCase().includes('clever'));
  });

  analysis.averageLength = Math.round(totalLength / responses.length);
  analysis.lengthVariation = Math.max(...responses.map(r => r.split(/\s+/).length)) - 
                             Math.min(...responses.map(r => r.split(/\s+/).length));

  return {
    ...analysis,
    metaphorDiversity: analysis.metaphorDiversity.size,
    toneConsistency: analysis.toneConsistency.size,
    summary: `Analyzed ${responses.length} responses with average length ${analysis.averageLength} words`
  };
}
