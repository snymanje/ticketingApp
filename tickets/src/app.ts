import express from "express";
import "express-async-errors";
import cookieSession from 'cookie-session';

import { errorHandler } from "@snymanje/common";
import { NotFoundError } from "@snymanje/common";

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV === 'Production',
}))

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };