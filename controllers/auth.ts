import type { RouterContext } from "../deps.ts";
import { Bson } from "../deps.ts";
import type { CreateUserInput, LoginUserInput } from "../schema/user.ts";
import { User } from "../models/user.ts";
import { comparePasswords, hashPassword } from "../utils/password.ts";
import { signJwt } from "../utils/jwt.ts";
import omitFields from "../utils/omitfields.ts";
import config from "../config/default.ts";

// [...] Signup User Controller
const signUpUserController = async ({
  request,
  response,
}: RouterContext<string>) => {
  try {
    const { name, email, password,imageUrl }: CreateUserInput = await request.body()
      .value;
      const isUser = await User.findOne({ email: email });

      if (isUser) {
        response.status = 401;
        response.body = {
          status: 'fail',
          message: 'User with this emailId already exists',
        };
        return;
      }

    const hashedPassword = await hashPassword(password);
    const createdAt = new Date();
    const updatedAt = createdAt;

    const userId: string | Bson.ObjectId = await User.insertOne({
      name,
      email,
      password: hashedPassword,
      imageUrl,
      role: "user",
      verified: false,
      createdAt,
      updatedAt,
    });

    if (!userId) {
      response.status = 500;
      response.body = { status: "error", message: "Error creating user" };
      return;
    }

    const user = await User.findOne({ _id: userId });

    response.status = 201;
    response.body = {
      status: "success",
      user: omitFields(user, "password", "verified"),
    };
    return
  } catch (error) {
    if((error.message as string).includes("E11000")){
      response.status = 409;
      response.body = { status: "fail", message: "A user with that email already exists" };
      return;
    }
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

const loginUserController = async ({
    request,
    response,
    cookies,
  }: RouterContext<string>) => {
    try {
      const { email, password }: LoginUserInput = await request.body().value;
  
      const message = "Invalid email or password";
      const userExists = await User.findOne({ email });
      if (
        !userExists ||
        !(await comparePasswords(password, userExists?.password))
      ) {
        response.status = 401;
        response.body = {
          status: "fail",
          message,
        };
        return;
      }
  
      const token = await signJwt({
        userId: String(userExists._id),
        expiresIn: config.jwtExpiresIn,
        secretKey: config.jwtSecret,
      });
      cookies.set("token", token, {
        expires: new Date(Date.now() + config.jwtExpiresIn * 60 * 1000),
        maxAge: config.jwtExpiresIn * 60,
        httpOnly: true,
        secure: false,
      });
  
      response.status = 200;
      response.body = { status: "success", token };
    } catch (error) {
      response.status = 500;
      response.body = { status: "error", message: error.message };
      return;
    }
  };
  
  const logoutController = ({ response, cookies }: RouterContext<string>) => {
    cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: -1,
    });
  
    response.status = 200;
    response.body = { status: "success" };
  };
  export default { signUpUserController, loginUserController, logoutController };
  