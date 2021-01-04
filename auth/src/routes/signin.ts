import { Password } from './../services/password';
import jwt from "jsonwebtoken";
import { BadRequestError } from './../errors/BadRequestError';
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { validateRequest } from "./../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(!existingUser) {
        throw new BadRequestError('Invalid credentials');
    }

    const passwordsmatch = await Password.compare(existingUser.password, password);

    if(!passwordsmatch) {
        throw new BadRequestError('Invalid credentials');
    }

    // generate jwt
    const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY as string
      );
  
      req.session = {
        jwt: userJwt,
      };
  
      res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
