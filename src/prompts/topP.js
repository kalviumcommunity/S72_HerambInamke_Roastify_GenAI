export function buildTopPPrompt({
  persona = "You are Roastify, a witty, good-natured roast comic.",
  task = "Given a SUBJECT, produce one clever, playful roast.",
  subject = "a generic user",
  topP = 0.8,
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

  const topPDescription = getTopPDescription(topP);

  return `
${persona}

Task:
${task}

Top P Setting: ${topP} (${topPDescription})

Constraints:
${constraintsList}

Style Hints:
${styleList}

Example:
- Input (SUBJECT): ${example.input}
- Output (ROAST): ${example.output}

Now respond in the same style with Top P ${topP}.
SUBJECT: ${subject}
ROAST:`.trim();
}

export function getTopPDescription(topP) {
  if (topP <= 0.1) return "Very Low - Highly focused on most probable tokens";
  if (topP <= 0.3) return "Low - Concentrated on high-probability outputs";
  if (topP <= 0.5) return "Medium - Balanced probability distribution";
  if (topP <= 0.7) return "Medium-High - Good diversity with quality";
  if (topP <= 0.9) return "High - Diverse and creative responses";
  return "Very High - Maximum diversity and exploration";
}

export function getTopPSettings() {
  return [
    { value: 0.1, name: "Very Low", description: "Highly focused, most probable tokens only" },
    { value: 0.3, name: "Low", description: "Concentrated on high-probability outputs" },
    { value: 0.5, name: "Medium", description: "Balanced probability distribution" },
    { value: 0.7, name: "Medium-High", description: "Good diversity while maintaining quality" },
    { value: 0.9, name: "High", description: "Diverse and creative responses" }
  ];
}

export function analyzeTopPImpact(responses) {
  if (!responses || responses.length < 2) {
    return { message: "Need at least 2 responses to analyze Top P impact" };
  }

  const analysis = {
    responseCount: responses.length,
    averageLength: 0,
    lengthVariation: 0,
    vocabularyDiversity: new Set(),
    creativityIndicators: new Set(),
    qualityMetrics: {
      metaphorCount: 0,
      wordplayCount: 0,
      uniqueWords: new Set()
    }
  };

  let totalLength = 0;
  responses.forEach(response => {
    const words = response.split(/\s+/);
    const wordCount = words.length;
    totalLength += wordCount;
    
    // Analyze vocabulary diversity
    words.forEach(word => {
      analysis.qualityMetrics.uniqueWords.add(word.toLowerCase());
    });
    
    // Analyze creativity indicators
    const hasMetaphor = response.toLowerCase().includes('like') || response.toLowerCase().includes('as') || response.toLowerCase().includes('is a');
    const hasWordplay = response.toLowerCase().includes('pun') || response.toLowerCase().includes('play on words') || response.toLowerCase().includes('double meaning');
    
    if (hasMetaphor) analysis.qualityMetrics.metaphorCount++;
    if (hasWordplay) analysis.qualityMetrics.wordplayCount++;
    
    analysis.creativityIndicators.add(hasMetaphor || hasWordplay);
  });

  analysis.averageLength = Math.round(totalLength / responses.length);
  analysis.lengthVariation = Math.max(...responses.map(r => r.split(/\s+/).length)) - 
                             Math.min(...responses.map(r => r.split(/\s+/).length));
  analysis.vocabularyDiversity = analysis.qualityMetrics.uniqueWords.size;
  analysis.creativityIndicators = analysis.creativityIndicators.size;

  return {
    ...analysis,
    summary: `Analyzed ${responses.length} responses with average length ${analysis.averageLength} words`,
    qualityScore: Math.round((analysis.qualityMetrics.metaphorCount + analysis.qualityMetrics.wordplayCount) / responses.length * 100),
    diversityScore: Math.round((analysis.vocabularyDiversity / (analysis.averageLength * responses.length)) * 100)
  };
}

export function compareTopPvsTemperature(topPResponses, tempResponses) {
  if (!topPResponses || !tempResponses) {
    return { message: "Need both Top P and Temperature responses for comparison" };
  }

  const topPAnalysis = analyzeTopPImpact(topPResponses);
  const tempAnalysis = analyzeTopPImpact(tempResponses);

  return {
    topP: topPAnalysis,
    temperature: tempAnalysis,
    comparison: {
      topPAdvantage: "More controlled diversity, maintains quality",
      temperatureAdvantage: "More random creativity, varied outputs",
      recommendation: topPAnalysis.qualityScore > tempAnalysis.qualityScore ? 
        "Top P better for quality-focused tasks" : 
        "Temperature better for creative variety"
    }
  };
}
