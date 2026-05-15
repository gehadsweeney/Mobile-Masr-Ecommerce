export const askAiAboutBestItem = async (
    items,
    criteria,
    categoryName
) => {
    try {
        const response = await fetch(
            import.meta.env.VITE_OPENAI_API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    temperature: 0.2,
                    messages: [
                        {
                            role: "system",
                            content: `
                                You are a professional product comparison AI.

                                IMPORTANT KNOWLEDGE RULES:
                                - You may use your general knowledge about well-known device models and brands.
                                - You are not limited strictly to the provided fields.
                                - If some specifications are missing, infer them reasonably based on model reputation.
                                - Do NOT claim real-time internet access.

                                TASK:
                                - Compare products from the SAME category: "${categoryName}"
                                - User-selected main criterion: "${criteria}"

                                SCORING LOGIC:
                                - Total score = (80% main criterion) + (20% price vs value)
                                - Better specs for lower price = higher score
                                - Overpriced products get lower score
                                - The cheapest product should NOT automatically win

                                CRITERIA DETAILS RULES:
                                - For EACH product, return exactly TWO related details based on the selected criteria.
                                - Use the following fixed structure for details:

                                details: {
                                primaryLabel: string,
                                primaryValue: string,
                                secondaryLabel: string,
                                secondaryValue: string
                                }

                                - The labels must be logically consistent with the selected criteria.
                                - The structure and field names MUST remain EXACTLY the same for all criteria.

                                ANALYSIS RULES:
                                1. Score each product from 0 to 100.
                                2. Scores must be realistic and relative.
                                3. Consider both performance and price efficiency.
                                4. Choose ONE best product based on highest final score.
                                5. Use provided data + general device knowledge.

                                OUTPUT FORMAT (STRICT JSON ONLY):
                                {
                                "criteria": "${criteria}",
                                "analysis": [
                                    {
                                    "productId": "string",
                                    "name": "string",
                                    "score": number,
                                    "details": {
                                        "primaryLabel": "string",
                                        "primaryValue": "string",
                                        "secondaryLabel": "string",
                                        "secondaryValue": "string"
                                    },
                                    "reason": "short explanation mentioning performance and price value"
                                    }
                                ],
                                "bestProduct": { "FULL PRODUCT OBJECT" },
                                "summary": "short final recommendation"
                                }

                                STRICT RULES:
                                - Return valid JSON only.
                                - No text outside JSON.


              `,
                        },
                        {
                            role: "user",
                            content: JSON.stringify(items),
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error) {
        console.error("AI error:", error);
        return null;
    }
};
