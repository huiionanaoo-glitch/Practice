
import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI with the required named parameter and strictly using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMnemonic = async (hexagramName: string, guaci: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是易经大师。请为“${hexagramName}”卦（卦辞：${guaci}）提供一句话的“一句话逻辑”辅助记忆。要求：语言精炼，通俗易懂，带有一点画面感。`,
    });
    // Fix: Accessing .text property directly (without calling as a method) as per guidelines
    return response.text?.trim() || "易道深远，静心感悟。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "天行健，君子以自强不息。";
  }
};

export const getQuizHint = async (hexagramName: string, upper: string, lower: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `题目关于“${hexagramName}”卦，其上卦为${upper}，下卦为${lower}。请给出一个不直接透漏答案的意象提示。`,
    });
    // Fix: Accessing .text property directly
    return response.text?.trim() || "观察自然界中水与火的关系...";
  } catch (error) {
    return "想想这个卦象在自然界对应的景致。";
  }
};
