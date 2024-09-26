import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

// Interface for OpenAI's response format
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: {
      role: string;
      content: string | null;
    };
  }[];
}

// Interface to maintain the conversation history
interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Function to handle bargaining, maintaining conversation history
const bargainAI = async (input: string, conversationHistory: ConversationMessage[] = []): Promise<string> => {
  try {
    // Append the latest user message to the conversation history
    conversationHistory.push({
      role: "user",
      content: input,
    });

    // Create the response from the AI
    const response: OpenAIResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Assuming gpt-4o is a model fine-tuned for your specific needs
      messages: [
        {
          role: "system",
          content:
            "You are an experienced market shopper with expert bargaining skills. Your goal is to negotiate a fair price for a product that is priced too high. In each conversation, your aim is to both lower the price and teach the seller better negotiation skills. Offer helpful advice in brackets. Be clear and concise, and keep all prices in naira. A happy seller is more likely to compromise, so stay charming and polite!",
        },
        ...conversationHistory, // Include the full conversation history for context
      ],
      temperature: 1, // Creative and varied responses
      max_tokens: 256, // Reasonable limit for concise replies
      top_p: 1, // Keep top_p at 1 for deterministic responses
      frequency_penalty: 0, // No penalty for repeated phrases
      presence_penalty: 0, // Neutral presence penalty
    });

    // Append AI's response to the conversation history
    const aiResponse = response.choices[0].message.content;
    if (aiResponse === null) {
      throw new Error("AI response content is null");
    }

    // Add the AI's response to the conversation history as an assistant message
    conversationHistory.push({
      role: "assistant",
      content: aiResponse,
    });

    // Return the AI's response and the updated conversation history for future interactions
    return aiResponse;
  } catch (error) {
    throw new Error(`Error fetching AI response: ${error}`);
  }
};

export default bargainAI;
