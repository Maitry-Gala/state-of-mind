import { Router } from "express";
import { auth } from "../middleware/auth.js";
import OpenAI from "openai";
import type { Request, Response } from "express";
import { contentModel } from "../db.js";
import { askSchema } from "../schemas/user.schema.js";
import { validate } from "../middleware/validate.js";
import rateLimit from "express-rate-limit";

const askRouter: Router = Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const askLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => req.userId!,

  message: {
    message: "Too many questions. Please wait a minute before trying again.",
  },
});

askRouter.post(
  "/",
  auth,askLimiter,
  validate(askSchema),
  async (req: Request, res: Response) => {
    try {
      const {
        question,
        history = [],
      }: { question: string; history?: ChatMessage[] } = req.body;

      if (!question?.trim() || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required!" });
      }
      const items = await contentModel
        .find({ userId: req.userId })
        .select("title link description type")
        .sort({ _id: -1 })
        .limit(20);

      if (items.length === 0) {
        return res.status(200).json({
          answer:
            "You haven't saved anything yet. Add some content first, then ask me about it.",
          sources: [],
        });
      }

      const context = items
        .map(
          (item, i) =>
            `[${i + 1}] Title: ${item.title}\nType: ${item.type}\nDescription: ${item.description || "No description"}\nLink: ${item.link}`,
        )
        .join("\n\n");

      const recentHistory = Array.isArray(history) ? history.slice(-10) : []; // keeping last 10 messages

      const messages = [
        {
          role: "system" as const,
          content: `You are "Ask Your Brain", a personal knowledge assistant.

Use ONLY the user's saved notes below.

Rules:
- Answer naturally and conversationally.
- Summarize information instead of repeating raw note titles.
- If a note is only a bookmark or link with no description, say that it exists but explain that there isn't enough saved information to answer in detail.
- Never invent information.
- Cite notes like [1].
- Keep answers concise unless the user asks for more detail.

Saved Notes:
${context}`,
        },

        ...recentHistory,

        {
          role: "user" as const,
          content: question,
        },
      ];
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature:0.2,
        max_tokens: 400,
      });

      const answer =
        completion.choices[0]?.message?.content ??
        "I couldn't generate a response.";

      if (!answer) {
        return res.status(500).json({
          message: "Somrthing went wrong",
        });
      }
      return res.status(200).json({ answer });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
);

export default askRouter;
