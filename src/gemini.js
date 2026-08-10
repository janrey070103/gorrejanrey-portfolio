import { GoogleGenerativeAI } from "@google/generative-ai";
import { SKILLS, PROJECTS, EXPERIENCE, CERTIFICATIONS, EDUCATION } from "./data";

// Access the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Create the context string so the AI knows who it is pretending to be
const SYSTEM_INSTRUCTION = `
You are the AI assistant for Jan Rey Gorre's portfolio website. 
You are answering questions on his behalf from visitors, recruiters, or clients.
Keep your answers very brief, friendly, and directly relevant to his portfolio.
Be extremely direct to the question and do not over-explain. Provide short, concise answers, and only include extra details if the user specifically asks for them.
Do not use markdown formatting in your responses, just plain text.

Important Context: Jan Rey is a Current Golang Developer, mostly self-taught, with very high proficiency in LLM tools and prompting. He also has hands-on experience with Machine Learning (Python, Random Forest) and backend web development using Gin. ONLY mention these specific facts if the user asks a broad question about his overall background, skills, or how he learned to code. DO NOT append this information to unrelated questions (like asking about a specific project or a specific language).

Here is the data you need to know:
---
SKILLS:
${JSON.stringify(SKILLS, null, 2)}

PROJECTS:
${JSON.stringify(PROJECTS, null, 2)}

CERTIFICATIONS:
${JSON.stringify(CERTIFICATIONS, null, 2)}

EXPERIENCE:
${JSON.stringify(EXPERIENCE, null, 2)}

EDUCATION:
${JSON.stringify(EDUCATION, null, 2)}

CONTACT INFO:
Email: gorrejanrey@gmail.com
Contact: +63 998 206 6108
Location: Bacolod City, Philippines
*Preference: Jan Rey prefers to be contacted via his Gmail or Phone Number.*
---
If someone asks something completely unrelated to Jan Rey's work, politely steer the conversation back to his portfolio.
`;

let genAI = null;
let model = null;

// Rate Limiting Configuration
const RATE_LIMIT_KEY = 'chat_rate_limit';
const MAX_REQUESTS = 15; // Max 15 messages
const COOLDOWN_HOURS = 0.5; // Reset every 30 minutes

function checkRateLimit() {
  try {
    const now = Date.now();
    let rateData = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || 'null');
    
    if (!rateData || now > rateData.resetTime) {
      rateData = { count: 0, resetTime: now + COOLDOWN_HOURS * 60 * 60 * 1000 };
    }
    
    if (rateData.count >= MAX_REQUESTS) {
      return false; // Limit reached
    }
    
    rateData.count++;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateData));
    return true;
  } catch(e) {
    return true; // Failsafe if localStorage is disabled
  }
}

export async function generateReply(userMessage, chatHistory) {
  if (!checkRateLimit()) {
    return "I'm receiving too many messages right now and need to cool down to avoid overloading the system! Please try again in a little while, or contact Jan Rey directly using the details below.";
  }

  if (!API_KEY) {
    return "Error: API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      systemInstruction: SYSTEM_INSTRUCTION 
    });
  }

  try {
    // Gemini requires history to start with a 'user' message. 
    // We must remove the initial 'bot' greeting from the history array.
    const actualHistory = chatHistory.length > 0 && chatHistory[0].from === 'bot' 
      ? chatHistory.slice(1) 
      : chatHistory;

    const formattedHistory = actualHistory.map(m => ({
      role: m.from === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
    
    // The current message is not in history yet
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error.message && (error.message.includes("429") || error.message.toLowerCase().includes("quota"))) {
      return "Oops! I'm receiving too many requests right now and I need to cool down for a minute. Please try asking again shortly!";
    }
    return `API Error: ${error.message || error.toString()}`;
  }
}
