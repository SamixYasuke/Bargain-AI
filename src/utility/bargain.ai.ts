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

// Dummy conversation in Nigerian Pidgin to fine-tune the model
const dummyConversation: ConversationMessage[] = [
  { role: "user", content: "How much be this tomatoes?" },
  { role: "assistant", content: "Ah! Na ₦1000 for one basket, but I fit give am for ₦800." },
  { role: "user", content: "₦800 still too much, how you go bring am come ₦600?" },
  { role: "assistant", content: "₦600 no go work na, but make I reason you small. I fit sell am for ₦700. [Tip: Try meet your customer halfway for better chance to sell]" },
  { role: "user", content: "₦700 no bad. Abeg wrap am for me!" },
  { role: "assistant", content: "Sharp sharp! I go wrap am for you now. [Tip: Quick response dey make customer happy]" }
];

// Function to handle bargaining, maintaining conversation history and using pidgin
const bargainAI = async (input: string, conversationHistory: ConversationMessage[] = dummyConversation): Promise<string> => {
  try {
    // Append the latest user message to the conversation history
    conversationHistory.push({
      role: "user",
      content: input,
    });

    // Create the response from the AI with conversation history
    const response: OpenAIResponse = await openai.chat.completions.create({
      model: "gpt-4o", // Assuming gpt-4o is a model fine-tuned for your specific needs
      messages: [
        {
          role: "system",
          content:
            "You be sharp market person wey sabi negotiate for Nigerian market. Anytime you dey talk, make sure you dey use Nigerian Pidgin to bargain price and teach the seller how to improve their negotiation skills. Use naira for prices, and stay friendly. Never start the conversation from scratch; continue from where e stop. Make the whole negotiation dey flow well without repeating any points.",
        },
        ...conversationHistory, // Include full conversation history for context
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
