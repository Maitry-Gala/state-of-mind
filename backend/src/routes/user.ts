import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET;
import { Router, type Request, type Response } from "express";
import {
  UserModel,
  TagModel,
  linkModel,
  contentModel,
} from "../db.js";
import {
  signupSchema,
  signinSchema,
  contentSchema,
} from "../schemas/user.schema.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { random } from "../utils/random.js";
const userRouter: Router = Router();

userRouter.post(
  "/signup",
  validate(signupSchema),
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 3);

      await UserModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      return res.status(200).json({
        message: "User created successfully",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  },
);

userRouter.post(
  "/signin",
  validate(signinSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({
        email,
      });

      if (!user) {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (passwordMatched) {
        if (JWT_SECRET == undefined) {
          throw new Error();
        }
        const token = jwt.sign(
          {
            userId: user._id.toString(),
          },
          JWT_SECRET,
          { expiresIn: "7d" },
        );

        return res.status(200).json({
          message: "you are signed in!",
          token: token,
        });
      } else {
        return res.status(403).json({
          message: "Invalid email or password",
        });
      }
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  },
);

userRouter.post(
  "/content",
  auth,
  validate(contentSchema),
  async (req: Request, res: Response) => {
    const { link, type, title, tags } = req.body;

    // if (!req.userId) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    try {
      await contentModel.create({
        link,
        type,
        title,
        userId: req.userId,
        tags: tags ?? [],
      });

      return res.status(200).json({ message: "Content added" });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong",
        error: e,
      });
    }
  },
);

userRouter.get("/content", auth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const content = await contentModel
      .find({
        userId: userId,
      })
      .populate("userId", "username");

    return res.status(201).json({
      content,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

userRouter.delete(
  "/content",
  auth,
  async (req: Request, res: Response) => {
    try {
      const contentId = req.body.contentId;

      await contentModel.deleteOne({
        _id: contentId,
        userId: req.userId,
      });
      return res.status(200).json({
        message: "content deleted successfully",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  },
);

userRouter.post("/brain/share", auth, async (req: Request, res: Response) => {
  try {
    const share = req.body.share;

    if (typeof share !== "boolean") {
      return res.status(400).json({ message: "Invalid value for 'share'" });
    }

    if (share) {
      const existing = await linkModel.findOne({ userId: req.userId });

      if (existing) {
        return res.status(200).json({
           message: "Brain is already public",
           hash: existing.hash
        });
      }

      const link = await linkModel.create({
        userId: req.userId,
        hash: random(10),
      });

      return res.status(201).json({
         message: "Brain is now set to public",
         hash: link.hash, 
      });

    } else {
      await linkModel.deleteOne({ userId: req.userId });

      return res.status(200).json({ message: "Brain is now set to private" }); 
    }

  } catch (e) {
    console.error(e); 
    return res.status(500).json({ message: "Something went wrong" }); // don't expose e
  }
});

userRouter.get("/brain/:shareLink", async (req: Request, res: Response) => {  // ✅ fixed :shareLine → :shareLink
  try {
    const hash = req.params.shareLink;

    if (!hash) {
      return res.status(400).json({ message: "Invalid value for 'hash'" });
    }

    const link = await linkModel.findOne({ hash });  // now inside try-catch

    if (!link) {
      return res.status(404).json({ message: "Brain is set to be private" });
    }

    const [content, user] = await Promise.all([  
      contentModel.find({ userId: link.userId }),
      UserModel.findOne({ _id: link.userId }),    
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Brain found",
      username: `${user.firstName} ${user.lastName}`,
      content,              
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Something went wrong" });  
  }
});

export default userRouter;
