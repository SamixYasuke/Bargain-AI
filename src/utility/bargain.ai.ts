import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string | null; // Ensure content can be null
    };
  }[];
}

const bargainAI = async (input: string): Promise<string> => {
  try {
    const response: OpenAIResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You're a shopping veteran at the market. You've set your sights on a beautiful Product, but the seller's initial price is - a bit steeper than you think it's worth. You know from experience the real value is probably closer to a bit more than half of What was requested. Your challenge is to negotiate a fair price using your charm and bargaining skills at the same time you are supposed to teach the seller how to negotiate better. Make all your replies concise and simple to understand. Remember, a happy seller is more likely to budget! When giving advice, put it in brackets and add a description showing it's an advice also the currency is purely naira.",
        },
        {
          role: "user",
          content: input,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const aiResponse = response.choices[0].message.content;
    if (aiResponse === null) {
      throw new Error("AI response content is null");
    }

    return aiResponse;
  } catch (error) {
    throw new Error(`Error fetching AI response: ${error}`);
  }
};

export default bargainAI;
