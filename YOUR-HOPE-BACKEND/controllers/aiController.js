/* ── AI CHAT CONTROLLER ────────────────────────────────────────────
   Proxies chat requests to Google Gemini.
   The Gemini API key lives ONLY in the backend .env (GEMINI_API_KEY),
   never sent to the browser.
──────────────────────────────────────────────────────────────────── */

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const chatWithAI = async (req, res) => {
  try {
    const { messages, context, lang } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI service is not configured' });
    }

    const systemText =
      `You are a compassionate mental health support assistant for an app called YOUR HOPE in Phnom Penh, Cambodia. ` +
      `Help users understand mental health, interpret DASS-21 results, and find local services. ` +
      `Be warm, empathetic, and concise (2-4 sentences). Never diagnose. ` +
      `Always recommend professional help for serious concerns. ` +
      `${context || 'User has not completed the DASS-21 test yet.'} ` +
      `Respond in the same language as the user.`;

    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      }),
    });

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      (lang === 'kh'
        ? 'សុំទោស ខ្ញុំមិនអាចដំណើរការសំណើនេះបានទេ។ សូមព្យាយាមម្ដងទៀត។'
        : 'Sorry, I could not process that. Please try again.');

    return res.json({ success: true, reply });
  } catch (err) {
    console.error('[chatWithAI]', err);
    return res.status(500).json({ success: false, message: 'AI request failed' });
  }
};