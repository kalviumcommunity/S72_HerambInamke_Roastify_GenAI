export function buildStructuredOutputPrompt({
  persona = "You are Roastify, a witty, good-natured roast comic.",
  task = "Given a SUBJECT, produce a structured roast response.",
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
    output: {
      roast: "Your kitchen is a crime scene—evidence of good intentions, but the results are always suspicious.",
      tone: "playful",
      wordCount: 18,
      metaphor: "crime scene",
      category: "domestic skills"
    }
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

Structured Output Format:
You must respond with a valid JSON object containing:
- roast: The main roast text (≤ 25 words)
- tone: The emotional tone used (playful, witty, clever, etc.)
- wordCount: Exact word count of the roast
- metaphor: The main metaphor or figure of speech used
- category: The category this roast falls into

Example:
- Input (SUBJECT): ${example.input}
- Output (JSON): ${JSON.stringify(example.output, null, 2)}

Now respond in the same structured format.
SUBJECT: ${subject}
RESPONSE (JSON only):`.trim();
}

export function validateStructuredOutput(text) {
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(text);
    
    // Check required fields
    const requiredFields = ['roast', 'tone', 'wordCount', 'metaphor', 'category'];
    const missingFields = requiredFields.filter(field => !(field in parsed));
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        reason: `Missing required fields: ${missingFields.join(', ')}`,
        parsed: null
      };
    }
    
    // Validate word count
    if (typeof parsed.wordCount !== 'number' || parsed.wordCount <= 0) {
      return {
        isValid: false,
        reason: 'Invalid word count',
        parsed: null
      };
    }
    
    // Validate roast length
    const actualWordCount = parsed.roast.split(/\s+/).length;
    if (actualWordCount > 25) {
      return {
        isValid: false,
        reason: `Roast too long: ${actualWordCount} words (max 25)`,
        parsed: null
      };
    }
    
    return {
      isValid: true,
      reason: 'Valid structured output',
      parsed: parsed
    };
  } catch (err) {
    return {
      isValid: false,
      reason: 'Invalid JSON format',
      parsed: null
    };
  }
}
