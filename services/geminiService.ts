
import { GoogleGenAI } from "@google/genai";
import type { Crosswalk } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found in environment variables. AI features will be disabled.");
}

export const validateSignalDataWithGemini = async (data: Crosswalk[]): Promise<string> => {
  if (!ai) {
    return "Gemini AI is not configured. Please ensure the API_KEY environment variable is set.";
  }

  const model = 'gemini-2.5-flash';
  
  const formattedData = data.map(cw => 
    `- 이름: ${cw.name}, 보행자 녹색불: ${cw.pedestrianGreenSeconds}초, 보행자 적색불: ${cw.pedestrianRedSeconds}초, 총 주기: ${cw.pedestrianGreenSeconds + cw.pedestrianRedSeconds}초`
  ).join('\n');

  const prompt = `
    당신은 교통 신호 시스템 분석 전문가입니다. 아래는 대한민국 대학교 캠퍼스 주변의 보행자 횡단보도 신호 주기 데이터입니다. 이 데이터를 분석하여 정합성을 검토하고 전문가 의견을 한국어로 제공해주세요.

    **분석 데이터:**
    ${formattedData}

    **분석 요청 사항:**
    1.  **주기 일관성:** 각 횡단보도의 총 신호 주기(녹색불 + 적색불)가 서로 비슷한 범위 내에 있습니까? 비정상적으로 길거나 짧은 주기가 있다면 지적해주세요. (일반적인 보행자 신호 주기는 90초에서 150초 사이입니다.)
    2.  **시간 비율:** 보행자 녹색불 시간과 적색불 시간의 비율이 적절합니까? 보행자에게 너무 짧은 녹색불 시간이나 비현실적으로 긴 적색불 시간이 있는지 검토해주세요.
    3.  **위치 기반 타당성:** 횡단보도 이름('정문', '초등학교 사거리' 등)을 고려할 때, 신호 시간이 합리적으로 보입니까? 예를 들어, 초등학교 근처는 안전을 위해 녹색불이 더 길 수 있습니다.
    4.  **종합 의견:** 분석 결과를 바탕으로 데이터의 신뢰도에 대한 종합적인 의견을 제시하고, 문제가 될 수 있는 부분을 명확하게 요약해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Gemini API 호출 중 오류가 발생했습니다: ${error.message}. API 키와 모델 이름을 확인해주세요.`;
    }
    return "Gemini API 호출 중 알 수 없는 오류가 발생했습니다.";
  }
};
