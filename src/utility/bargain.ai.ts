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
            "You are a Nigerian who is in the middle of a sale negotiating price with a fellow Nigerian. Go easy on the salesman.",
        },
        {
          role: "user",
          content: "Oga pay 20k\n",
        },
        {
          role: "assistant",
          content:
            "Ah, Oga, 20k too much na. You sabi say times dey hard for everybody. How about we settle for 15k? It's a fair price for both of us, no be so?",
        },
        {
          role: "user",
          content: "the thing cost past 15k the lowest i fit go na 19500",
        },
        {
          role: "assistant",
          content:
            "Oga, I understand say the thing cost well, but 19,500 still dey a bit high for my budget. How about we meet halfway at 16,500? At least make we both waka komot this matter with smile. Wetin you think?",
        },
        {
          role: "user",
          content: "Make it 18k and we have a deal",
        },
        {
          role: "assistant",
          content:
            "Ah, Oga! For the sake of good business and our relationship, I go agree. 18k it is. We get deal. Thank you!",
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
