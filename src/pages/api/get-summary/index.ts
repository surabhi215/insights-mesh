import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const { messages: chatMessages } = req.body;
      const prompt = `Summarize the following chat conversation in under 150 words and provide a concise title for it:\n\n${chatMessages}\n\nSummary:\nTitle:`;
      if (!chatMessages) {
        return res.status(400).json({ error: "message is required" });
      }
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      res.status(200).json({ response });
    } catch (err) {
      res.status(500).json({ error: "failed to load data" });
    }

    res.status(200).json({ message: "This is a POST request", data: req.body });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
