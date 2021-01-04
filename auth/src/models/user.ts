import { Password } from "./../services/password";
import mongoose, { Document } from "mongoose";

// An interface that describes this object
export interface UserAttrs extends Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret.password;
        delete ret._id;
      }
    }
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

/* userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_: any, ret: { password: any; _id: any }) {
    // remove these props when object is serialized
    delete ret.password;
    delete ret._id;
  }
}); */

const User = mongoose.model<UserAttrs>("User", userSchema);

export { User };
