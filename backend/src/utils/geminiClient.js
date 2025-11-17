// utils/geminiClient.fixed.js
const axios = require("axios");
const https = require("https");

const agent = new https.Agent({ keepAlive: true });

async function extractJsonFromText(text) {
  try { return JSON.parse(text); } catch (e) {}
  const jsonMatch = text.match(/({[\s\S]*}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch (e) {}
  }
  throw new Error("Could not parse JSON from model output");
}

async function fetchAlternatives(medicineName) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  // keep the prompt explicit about returning PURE JSON ONLY
  const body = {
    contents: [
      {
        parts: [
          {
            text: `ACT AS A MEDICAL EXPERT AND PHARMACIST. Find 3-5 BUDGET-FRIENDLY brand name alternatives for the medicine: "${medicineName}".

RETURN PURE JSON ONLY - NO MARKDOWN, NO EXPLANATIONS, NO CODE BLOCKS.

REQUIRED JSON FORMAT:
{
  "alternatives": [
    {"name": "Brand Name 1", "price": "XXX INR", "link": null},
    {"name": "Brand Name 2", "price": "XXX INR", "link": null}
  ]
}

CRITICAL RULES:
1. Return only BRAND NAMES (commercial names), not chemical/generic names
2. All medicines must be available in Indian market
3. PRIORITIZE BUDGET/ECONOMY brands and generic manufacturers
4. Price should be in INR format like "80-120 INR", "150 INR"
5. Focus on alternatives that cost UNDER 200 INR when possible
6. Include brands from manufacturers like: Sun Pharma, Cipla, Dr. Reddy's, Lupin, Mankind, Alkem, etc.
7. Avoid premium/expensive brands unless no cheaper options exist
8. Always return at least 3-4 alternatives
9. If no link available, use "link": null
10. NO ADDITIONAL TEXT - ONLY VALID JSON`
          }
        ]
      }
    ]
  };

  // small helper to perform request with optional retry
  async function doRequest(attempt = 1) {
    try {
      const resp = await axios.post(url, body, {
        timeout: 30000,
        httpsAgent: agent,
        headers: { "Content-Type": "application/json" }
      });

      console.log("Gemini status:", resp.status);
      // locate model text in common shapes
      let rawText = null;
      if (resp.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        rawText = resp.data.candidates[0].content.parts[0].text;
      } else if (typeof resp.data?.text === "string") {
        rawText = resp.data.text;
      } else {
        console.error("Unexpected Gemini response shape:", resp.data);
        throw new Error("Unexpected response structure from Gemini API");
      }

      const cleaned = rawText.trim().replace(/^```json\s*|\s*```$/g, '').trim();
      const result = await extractJsonFromText(cleaned);
      return result;

    } catch (error) {
      // If server responded with something, show full details for debugging
      if (error.response) {
        console.error("Gemini API error status:", error.response.status);
        try {
          console.error("Gemini body:", JSON.stringify(error.response.data, null, 2));
        } catch (e) {
          console.error("Gemini body (non-json):", error.response.data);
        }
        console.error("Gemini headers:", error.response.headers);

        // For client errors (4xx), do NOT retry — return meaningful error
        if (error.response.status >= 400 && error.response.status < 500) {
          throw new Error(`Failed to fetch alternatives: ${error.response.status}`);
        }
      } else {
        console.error("Gemini request error:", error.message);
      }

      // Retry once for transient server/network errors (simple backoff)
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 500 * attempt));
        return doRequest(attempt + 1);
      }

      throw new Error("Failed to fetch alternatives");
    }
  }

  return doRequest();
}

module.exports = fetchAlternatives;
