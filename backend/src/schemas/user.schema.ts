import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().min(3).max(25).email(),
  password: z
    .string()
    .min(6)
    .max(10)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%*?&])[A-Za-z\d@!$%*?&]+$/),
  firstName: z.string().min(3).max(10),
  lastName: z.string().min(3).max(10),
});

export const signinSchema = z.object({
  email: z.string().min(3).max(25).email(),
  password: z
    .string()
    .min(6)
    .max(10)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%*?&])[A-Za-z\d@!$%*?&]+$/),
});

const contentType = ["image", "video", "article", "audio"] as const;

export const contentSchema = z.object({
  link: z.string().url(),
  type: z.enum(contentType),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const askSchema = z.object({
  question: z.string().trim().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
});
export type ContentFormData = z.infer<typeof contentSchema>;
