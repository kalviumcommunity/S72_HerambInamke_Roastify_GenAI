export async function measureAsync(operationName, operation) {
  const start = performance.now();
  let result;
  let error;
  try {
    result = await operation();
    return { ok: true, result, metrics: buildMetrics(operationName, start) };
  } catch (err) {
    error = err;
    return { ok: false, error, metrics: buildMetrics(operationName, start) };
  }
}

function buildMetrics(operationName, start) {
  const end = performance.now();
  const durationMs = Math.round(end - start);
  return { operationName, durationMs, startedAt: new Date(performance.timeOrigin + start).toISOString() };
}

export function extractUsageMetadata(response) {
  try {
    const usage = response?.response?.usageMetadata || response?.usageMetadata;
    if (!usage) return null;
    return {
      promptTokenCount: usage.promptTokenCount,
      candidatesTokenCount: usage.candidatesTokenCount,
      totalTokenCount: usage.totalTokenCount
    };
  } catch {
    return null;
  }
}

export function basicCorrectnessCheck(text) {
  if (typeof text !== "string" || !text.trim()) return { isLikelyValid: false, reason: "Empty response" };
  const lengthOk = text.trim().length >= 5;
  return { isLikelyValid: lengthOk, reason: lengthOk ? "Non-empty natural language output" : "Too short" };
}

