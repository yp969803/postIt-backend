import { Router } from "../deps.ts";
import userController from "../controllers/user.ts";
import requireUser from "../middleware/requireUser.ts";

const router = new Router();

router.get<string>("/me", requireUser, userController.getMeController);
router.get<string>("/pay",requireUser,userController.pay);
router.get<string>("/updateProfile",requireUser,userController.updateProfile);
router.get<string>("/getUser/:email",requireUser,userController.getUser)
export default router;
