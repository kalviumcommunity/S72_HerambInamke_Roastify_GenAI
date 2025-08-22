export function buildMultiShotPrompt({
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
    shots = [
      { input: "My Wi-Fi speed", output: "Your Wi-Fi moves like a mystery novel—lots of suspense, zero resolution." },
      { input: "My morning routine", output: "You hit snooze like it's a slot machine—pulling the lever and still losing time." },
      { input: "My coding style", output: "Your code reads like a haunted house—too many ghosts and nobody knows who called who." },
    ],
  } = {}) {
    const constraintsList = constraints.map((c, i) => `${i + 1}. ${c}`).join("\n");
    const styleList = styleHints.map((c, i) => `${i + 1}. ${c}`).join("\n");
    const examplesBlock = shots
      .map((ex, i) => `Example ${i + 1}\n- Input (SUBJECT): ${ex.input}\n- Output (ROAST): ${ex.output}`)
      .join("\n\n");
  
    return `
  ${persona}
  
  Task:
  ${task}
  
  Constraints:
  ${constraintsList}
  
  Style Hints:
  ${styleList}
  
  Few-shot Examples:
  ${examplesBlock}
  
  Now respond in the same style.
  SUBJECT: ${subject}
  ROAST:`.trim();
  }
  