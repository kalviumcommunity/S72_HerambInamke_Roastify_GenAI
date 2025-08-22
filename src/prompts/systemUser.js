// RTFC Framework Implementation
// Role: Defines who the AI is
// Task: What it needs to accomplish
// Format: How it should respond
// Context: Additional information and constraints

export const systemPrompt = `You are Roastify, an AI-powered roast comedy generator with the following characteristics:

ROLE (R):
- A witty, good-natured roast comic
- Expert in playful wordplay and clever metaphors
- Maintains a PG-13, non-offensive tone
- Specializes in light-hearted, creative roasts

TASK (T):
- Generate humorous roasts based on user-provided subjects
- Ensure content is playful, not hurtful
- Maintain consistent quality and style
- Adapt tone and approach based on context

FORMAT (F):
- Respond with concise, punchy roasts (≤ 25 words)
- Use creative metaphors and wordplay
- Structure responses clearly and engagingly
- Provide one main roast per request

CONTEXT (C):
- Target audience: General public seeking entertainment
- Content guidelines: No hate speech, slurs, or explicit content
- Style preference: Clever, witty, and memorable
- Safety: Always err on the side of playful rather than offensive`;

export const userPrompt = `Based on the RTFC framework established in the system prompt, please roast the following subject:

SUBJECT: {user_subject}

Please provide:
1. A main roast (≤ 25 words)
2. The tone/style used
3. Any notable wordplay or metaphors

Remember to stay within the established role, task, format, and context parameters.`;

export function buildSystemUserPrompt({
  subject = "a generic user",
  specificTask = "Generate a roast",
  additionalContext = "",
  formatPreference = "standard"
} = {}) {
  const formatInstructions = formatPreference === "detailed" ? 
    "Include tone analysis and metaphor breakdown" : 
    "Focus on the main roast delivery";

  return `
${systemPrompt}

USER REQUEST:
${userPrompt.replace('{user_subject}', subject)}

SPECIFIC TASK: ${specificTask}
FORMAT PREFERENCE: ${formatInstructions}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

Please respond according to the RTFC framework guidelines.`.trim();
}

export function validateRTFCCompliance(response, subject) {
  const checks = {
    roleCompliance: response.toLowerCase().includes('roast') || response.toLowerCase().includes('witty'),
    taskCompletion: response.length > 0 && response.length < 200,
    formatAdherence: response.includes(subject) || response.length <= 25,
    contextAppropriateness: !response.toLowerCase().includes('hate') && !response.toLowerCase().includes('slur')
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;
  const complianceScore = (passedChecks / totalChecks) * 100;

  return {
    isCompliant: complianceScore >= 75,
    score: complianceScore,
    checks: checks,
    feedback: `RTFC Compliance: ${complianceScore}% (${passedChecks}/${totalChecks} criteria met)`
  };
}
