import { Router } from "../deps.ts";
import authController from "../controllers/auth.ts";
import { createUserSchema, loginUserSchema } from "../schema/user.ts";
import validate from "../middleware/validate.ts";
import requireUser from "../middleware/requireUser.ts";

const router = new Router();

router.post<string>(
  "/register",
  validate(createUserSchema),
  authController.signUpUserController,
);
router.post<string>(
  "/login",
  validate(loginUserSchema),
  authController.loginUserController,
);

router.get<string>("/logout", requireUser, authController.logoutController);

export default router;
