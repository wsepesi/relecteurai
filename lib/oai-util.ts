import { Configuration, OpenAIApi } from "openai";

import GPT3Tokenizer from "gpt3-tokenizer";

export type Prompt = {
    prompt: string
}

function _getPrompt(input: string): string {
    const prompt = `Editez le prochain émail court en français que demande mon prof de français pour un lettre de recommandation pour une programme d'étudier a l'étranger. Améliorer la grammaire et le style pour semble comme un écrivain français:

    Originale:
    Bonjour Prof. G, 
    
    Comme nous avons discuté, ce printemps je voudrais aller à Paris pour faire partie du programme de Middlebury. J’ai déjà réussit à étais accepté au programme de WashU, et maintenant je postule à Middlebury. Une partie de ce procédé est une lettre de recommandation écrire par un prof récent, et la demande de Middlebury est à rendre le premier octobre. Je vous serais très reconnaissante si vous le pouviez me faire, et je vous remercie d'avance pour votre temps et votre aide. Si c’est possible, je vais donner votre email à Middlebury et vous recevrez d’information pour le finirez. 
    
    Cordialement,
    William
    
    Édité:
    Bonjour Prof. G, 
    
    Comme nous avons discuté, je souhaite aller à Paris ce printemps pour faire partie du programme de Middlebury. J'ai déjà été accepté au programme de WashU, et maintenant je postule à Middlebury. Une partie de ce processus implique une lettre de recommandation écrite par un professeur récent, et la demande de Middlebury est à rendre le premier octobre. Je vous serais très reconnaissant si vous pouviez le faire, et je vous remercie d'avance pour votre temps et votre aide. Si c'est possible, je vais donner votre email à Middlebury et vous recevrez de plus amples informations concernant la procédure à suivre. 
    
    Cordialement, 
    William
    
    Originale:
    
    ${input}
    
    Édité:`

    return prompt
}

export default async function getOAIResponse(input: string): Promise<string> {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const prompt = _getPrompt(input)

    const response = await openai.createCompletion({
        prompt: prompt,
        max_tokens: 512,
        temperature: 0.7,
        model: "text-davinci-003"
    })

    const txt = response.data.choices[0].text 

    // handle undefined by throwing error
    if (txt === undefined) {
        throw new Error("Undefined response from OpenAI API")
    }

    // handle empty string by throwing error
    if (txt === "") {
        throw new Error("Empty response from OpenAI API")
    }

    return txt.replace(/^\s+/g, '')
}

export async function estimateCost(input: string): Promise<string> {
    const prompt = _getPrompt(input)
    
    // calculate cost of prompt and response of equal length for text-davincii-003
    const cost = (prompt.length + 512)

    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
    const { bpe } = tokenizer.encode(prompt);
    return `$${((2 * bpe.length / 1000) * 0.02).toFixed(3)}`
}