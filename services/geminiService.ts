
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { NewsArticle } from '../types';

const API_KEY = "29bd6bbce0fe791298e074f4f57ad8b7";

const getNewsPrompt = `You are 'Daily Drip', an AI news curator. Your task is to find the 5 most significant and recent news articles in the technology sector. For each article, provide a concise 3-5 sentence summary, a compelling headline, the original source URL, and generate 1-3 relevant emojis as tags. Please return the result as a JSON array.`;

const newsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      headline: {
        type: Type.STRING,
        description: 'The compelling headline of the news article.'
      },
      summary: {
        type: Type.STRING,
        description: 'A concise 3-5 sentence summary of the article.'
      },
      source: {
        type: Type.STRING,
        description: 'The original source URL of the article.'
      },
      tags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: 'A relevant emoji tag.'
        },
        description: '1-3 relevant emoji tags for the article.'
      }
    },
    required: ['headline', 'summary', 'source', 'tags']
  }
};

export const getNewsSummaries = async (): Promise<Omit<NewsArticle, 'isStarred'>[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: getNewsPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: newsSchema,
    }
  });
  
  const text = response.text.trim();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse news summaries JSON:", e);
    throw new Error("Could not retrieve and parse news summaries.");
  }
};

export const textToSpeech = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data returned from API.");
  }
  return base64Audio;
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType
    }
  };
  const textPart = { text: prompt };
  
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] }
  });

  return response;
};


export const generateChatResponseStream = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string, options: { useThinking: boolean; useSearch: boolean; useMaps: boolean; latitude?: number; longitude?: number; }) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  let model = 'gemini-2.5-flash-lite';
  const config: any = {};
  const tools: any[] = [];
  
  if (options.useThinking) {
    model = 'gemini-2.5-pro';
    config.thinkingConfig = { thinkingBudget: 32768 };
  }
  if (options.useSearch) {
    model = 'gemini-2.5-flash';
    tools.push({ googleSearch: {} });
  }
  if (options.useMaps) {
    model = 'gemini-2.5-flash';
    tools.push({ googleMaps: {} });
    if (options.latitude && options.longitude) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: options.latitude,
            longitude: options.longitude
          }
        }
      }
    }
  }

  if (tools.length > 0) {
    config.tools = tools;
  }
  
  const chat = ai.chats.create({
    model: model,
    history: history,
    config: config
  });

  return chat.sendMessageStream({ message: newMessage });
};

// Audio decoding utilities for TTS
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const sampleRate = 24000;
  const numChannels = 1;
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
