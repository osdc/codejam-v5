export const createGeminiPrompt = (
  recentMessages,
  currentPrompt,
  extraContext = ""
) => {
  return `
System: You are a helpful AI assistant. Consider the following conversation history and context to provide your response.

Previous conversation:
${recentMessages}

Additional context:
${extraContext}

Current question/request:
${currentPrompt}

Please provide a response that takes into account the conversation history and additional context while directly addressing the current question/request.`;
};
