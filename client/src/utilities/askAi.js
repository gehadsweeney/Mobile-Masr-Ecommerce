const askAi = async (items, systemMessage, userPreMessage) => {
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
                    messages: [
                        {
                            role: "system",
                            content: systemMessage,
                        },
                        {
                            role: "user",
                            content: `${userPreMessage} ${JSON.stringify(items)}`,
                        },
                    ],
                }),
            }
        );
        const data = await response.json();
        const parsedContent = JSON.parse(data.choices[0].message.content);
        return parsedContent;
    } catch (error) {
        console.error("Error asking AI:", error);
        return null;
    }
};

export default askAi;