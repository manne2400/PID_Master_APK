import { GoogleGenAI } from "@google/genai";
import { ProcessParams, PIDResult, TuningMethod } from '../types';

export const getAIAdvice = async (
  params: ProcessParams, 
  pid: PIDResult, 
  method: TuningMethod
): Promise<string> => {
    
  if (!process.env.API_KEY) {
      return "Indsæt API nøgle for at få rådgivning.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Determine model based on complexity. Flash is sufficient for text analysis.
  const modelId = 'gemini-2.5-flash';

  const prompt = `
    You are an expert Control Systems Engineer. 
    Analyze the following PID tuning scenario for a generic First Order Plus Dead Time (FOPDT) process.
    
    Language: Danish (Dansk). Keep it short, professional, and helpful for a technician on site.
    
    System Parameters:
    - Process Gain (Kp): ${params.gain}
    - Time Constant (Tau): ${params.timeConstant}s
    - Dead Time (Theta): ${params.deadTime}s
    - Ratio (Theta/Tau): ${(params.deadTime / params.timeConstant).toFixed(2)}
    
    Calculated PID Values (Standard Form) using ${method} method:
    - Kp (Controller Gain): ${pid.Kp.toFixed(3)}
    - Ti (Integral Time): ${pid.Ti.toFixed(3)}s
    - Td (Derivative Time): ${pid.Td.toFixed(3)}s
    
    Please provide:
    1. A brief comment on the stability expectation (is the dead time dominant? is the gain aggressive?).
    2. A warning if D-action (Td) might be problematic (noise sensitivity).
    3. One tip for manual fine-tuning if the system oscillates.
  `;

  try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });

      return response.text || "Kunne ikke generere råd.";
  } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
  }
};