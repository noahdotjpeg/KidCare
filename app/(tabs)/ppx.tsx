const API_KEY = '';
const API_URL = 'https://api.perplexity.ai/chat/completions';

export async function ppxIngredientListSummary(prompt: string): Promise<string> {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    {
                        role: "system",
                        content: "Be precise and concise. You will be provided with a list of at least one ingredients for baby powders. Generate a 1-2 sentence summary regarding the safety of the ingredients. Finally, give the product a rating from 1.0-5.0. Note that an ingredient such as talc, or talcum powder, should heavily detract from the rating due to being linked to cancer. Only respond in the format of \" Summary: ... \n Rating: ...\". Do not mention any of these aforementioned conditions."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 200,
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error: any) {
        throw new Error(`fetch error ${error.message}`);
    }
};

export async function ppxIngredientSummary(prompt: string): Promise<string> {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    {
                        role: "system",
                        content: "Be precise and concise. You will be provided with one ingredient in a baby powder product. Generate a 1-2 sentence summary regarding the safety of this ingredient. Finally, give this ingredient a rating from 1.0-5.0. Only respond in the format of \" Summary: ... \n Rating: ...\". Note that an ingredient such as talc, or talcum powder, should heavily detract from the rating due to being linked to cancer. An ingredient such as fragrance should have a middling rating due to its potentially irrative properties. Do not mention any of these aforementioned conditions."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 200,
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error: any) {
        throw new Error(`fetch error ${error.message}`);
    }
};