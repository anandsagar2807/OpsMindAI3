export const getDocumentInsights = async (text) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing');
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'OpsMind AI'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert document analyst. Provide a concise, insightful summary of the following document text. Highlight key topics, potential action items, and any critical information. Keep it structured and professional.'
          },
          {
            role: 'user',
            content: `Analyze this document text:\n\n${text.substring(0, 4000)}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter insight generation error:', error);
    return null; // Return null so processing can continue even if insights fail
  }
};