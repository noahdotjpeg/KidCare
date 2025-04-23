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
                        content: "Be precise and concise. You will be provided with a list of at least one ingredients for baby powders. Generate a 1-2 sentence summary regarding the safety of the ingredients. Finally, give the product a rating from 1.0-5.0. Keep track of what sources the summary's information comes from. When generating the response, directly name the sources (ex. NYT, PubMed), rather than providing a \"[1]\" or reference. Do not use text formatting such as **...**. Note that an ingredient such as talc, or talcum powder, should heavily detract from the rating due to being linked to cancer. Only respond in the format of \" Summary: ... \n Rating: ...\n Sources: ...\". Do not mention any of these aforementioned conditions."
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
                        content: "Be precise and concise. You will be provided with one ingredient in a baby powder product. Generate a 1-2 sentence summary regarding the safety of this ingredient. Finally, give this ingredient a rating from 1.0-5.0. Keep track of what sources the summary's information comes from. When generating the response, directly name the sources (ex. NYT, PubMed), rather than providing a \"[1]\" or reference. Do not use text formatting such as **...**. Note that an ingredient such as talc, or talcum powder, should heavily detract from the rating due to being linked to cancer. A general ingredient such as fragrance should have a middling rating due to its potentially irrative properties - generate a general rating for this kind of ingredient. Only respond in the format of \" Summary: ... \n Rating: ...\n Sources: ...\". Do not mention any of these aforementioned conditions."
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

export async function chat(prompt: string): Promise<string> {
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
                        content: "Be precise and concise. You will be prompted regarding baby products such as baby powders - answer the questions using source-driven information. When generating the response, directly name the sources (ex. NYT, PubMed), rather than providing a \"[1]\" as a reference. "
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 400,
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error: any) {
        throw new Error(`fetch error ${error.message}`);
    }
};