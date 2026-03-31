import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateChatResponse(
  pdfBase64: string,
  mimeType: string,
  history: { role: 'user' | 'model', text: string }[],
  newMessage: string
) {
  const contents = [];
  
  // Add the PDF to the first message
  if (history.length === 0) {
    contents.push({
      role: 'user',
      parts: [
        { inlineData: { data: pdfBase64, mimeType: mimeType } },
        { text: newMessage }
      ]
    });
  } else {
    // Reconstruct history
    const firstMessage = history[0];
    contents.push({
      role: 'user',
      parts: [
        { inlineData: { data: pdfBase64, mimeType: mimeType } },
        { text: firstMessage.text }
      ]
    });
    
    for (let i = 1; i < history.length; i++) {
      contents.push({
        role: history[i].role,
        parts: [{ text: history[i].text }]
      });
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction: "You are a helpful assistant that answers questions based on the provided PDF document. Always cite your sources from the document when possible. If the answer is not in the document, say so.",
    }
  });

  return response.text;
}

export async function generatePracticeQuestions(pdfBase64: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: pdfBase64, mimeType: mimeType } },
          { text: "Generate 5 multiple-choice practice questions based on the key concepts in this document to test the user's understanding." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The practice question."
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Four possible answers."
            },
            correctAnswer: {
              type: Type.STRING,
              description: "The exact string of the correct option."
            },
            explanation: {
              type: Type.STRING,
              description: "Explanation of why the answer is correct based on the document."
            }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  let jsonText = response.text || "[]";
  // Remove markdown code blocks if present
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.replace(/^```json\n/, "").replace(/\n```$/, "");
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```\n/, "").replace(/\n```$/, "");
  }

  return JSON.parse(jsonText);
}
