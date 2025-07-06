import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const { payload } = req.body;
      const prevChat = payload?.messages || [];
      const userMessage = payload?.userMessage || "";
      if (!userMessage) {
        return res.status(400).json({ error: "User message is required" });
      }
      const chat = aiInstance.chats.create({
        model: "gemini-2.5-flash",
        history: prevChat,
      });

      const response = await chat.sendMessage({
        message: userMessage,
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
