import { Router } from "../deps.ts";
import userController from "../controllers/user.ts";
import requireUser from "../middleware/requireUser.ts";
import validate from "../middleware/validate.ts";
import { updateUserProfileSchema, getUserSchema  } from "../schema/user.ts";

const router = new Router();

router.get<string>("/me", requireUser, userController.getMeController);
router.get<string>("/pay",requireUser,userController.pay);
router.put<string>("/updateProfile",validate(updateUserProfileSchema),requireUser,userController.updateProfile);
router.get<string>("/getUser/:email",validate(getUserSchema),requireUser,userController.getUser)
export default router;
