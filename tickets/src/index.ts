import { app } from './app'
import mongoose from "mongoose";

const start = async () => {

  if(!process.env.JWT_KEY) {
    throw new Error("JWT_KEY needs to be defined.")
  }
  if(!process.env.MONGO_URI) {
    throw new Error("MONGO_URI needs to be defined.")
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongodb tickets DB')
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, async () => {
  console.log("Listening on port 3000!");
});

start();
