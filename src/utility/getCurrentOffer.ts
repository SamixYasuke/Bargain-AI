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

const getCurrentOffer = async (input: string): Promise<string> => {
  try {
    const response: OpenAIResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            You are a system that receives a text string as input and processes the text according to instructions.
            Processing:
            Identify the numeric subsequences within the text, including decimals and commas (e.g., 12,345.67, $1.5M) that refer to how much someone wants to pay for something.
            Recognize abbreviations for thousands ("k") and millions ("m") following a numeric value (case-insensitive). Interpret "k" as x 1,000 and "m" as x 1,000,000 (e.g., "5k" represents 5,000 and "10m" represents 10,000,000). Ignore any other letters after the number.
            Be currency agnostic. The system should not assume a specific currency symbol. If a currency symbol is present, it should be included in the extracted value (e.g., "$25K").
            Output: The system returns a list containing all identified monetary values found in the text string.
            Example:
            Input Text: "This used car costs $12,500. They might also accept an offer around 10k. For high-end models, some dealerships ask for prices in the 20m range." 
            Output: ["$12,500", "$10,000", "$20,000,000"]
            Additional Considerations:
            The system should be configurable to handle negative values or specific currency symbols if needed.
            The functionality can be extended to recognize other abbreviations like "billion" (b) or "trillion" (t).
            The system should handle potential errors gracefully, such as encountering non-numeric characters within a potential monetary value.
            Success Criteria:
            The system accurately extracts all monetary values from the provided text string, including those with abbreviations and different currency symbols.
            The extracted values retain the original formatting (e.g., including currency symbols and decimals).
            The system performs efficiently and can handle various text lengths and complexities.
          `,
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

    if (
      !response ||
      !response.choices ||
      !response.choices[0] ||
      !response.choices[0].message ||
      response.choices[0].message.content === null
    ) {
      throw new Error("AI response content is null or malformed");
    }
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`Error fetching AI response: ${error}`);
  }
};

export default getCurrentOffer;
