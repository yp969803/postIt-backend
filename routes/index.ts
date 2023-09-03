import { Application } from "../deps.ts";
import authRouter from "./auth.ts";
import userRouter from "./user.ts";
import noteRouter from './note.ts';

function init(app: Application) {
  app.use(authRouter.prefix("/api/auth/").routes());
  app.use(userRouter.prefix("/api/users/").routes());
  app.use(noteRouter.prefix("/api/notes/").routes())
}

export default {
  init,
};
