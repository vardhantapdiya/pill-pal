const axios = require("axios");

async function fetchAlternatives(medicineName) {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `ACT AS A MEDICAL EXPERT AND PHARMACIST. Find 3-5 BUDGET-FRIENDLY brand name alternatives for the medicine: "${medicineName}".

                                    IMPORTANT: Focus on AFFORDABLE and COST-EFFECTIVE alternatives that are significantly LOWER in price than premium brands.

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
                                    10. NO ADDITIONAL TEXT - ONLY VALID JSON
                                    
                                    EXAMPLE OF GOOD ALTERNATIVES: If searching for expensive branded medicine, return economical alternatives from generic manufacturers that cost 30-70% less.`
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                }
            }
        );

        if (!response.data.candidates || !response.data.candidates[0] || !response.data.candidates[0].content) {
            throw new Error("Unexpected response structure from Gemini API");
        }

        // Parse Gemini response
        const rawText = response.data.candidates[0].content.parts[0].text;

        let cleanedText = rawText.trim();
        cleanedText = cleanedText.replace(/^```json\s*|\s*```$/g, '');
        cleanedText = cleanedText.trim();
        
        const result = JSON.parse(cleanedText);
        
        // Optional: Filter out results that seem too expensive (above 500 INR)
        if (result.alternatives) {
            result.alternatives = result.alternatives.filter(alt => {
                const priceText = alt.price.toLowerCase();
                // Simple check to filter out very high prices
                const hasHighPrice = priceText.includes('500') || priceText.includes('600') || 
                                   priceText.includes('700') || priceText.includes('800') || 
                                   priceText.includes('900') || priceText.includes('1000');
                return !hasHighPrice;
            });
        }
        
        return result;

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw new Error("Failed to fetch alternatives");
    }
}

module.exports = fetchAlternatives;