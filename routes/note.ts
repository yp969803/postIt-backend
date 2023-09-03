import { Router } from "../deps.ts";
import noteController  from "../controllers/note.ts";
import requireUser from "../middleware/requireUser.ts";
import {createNoteSchema,updateNoteSchema,deleteNoteSchema,getAllNotesSchema,getNoteSchema   } from "../schema/note.ts";
import validate from "../middleware/validate.ts";
const router = new Router();

router.post<string>("/create",validate(createNoteSchema) ,requireUser, noteController.createController);
router.put<string>("/update/:noteId",validate(updateNoteSchema),requireUser,noteController.updateController);
router.delete<string>("/delete/:noteId",requireUser,validate(deleteNoteSchema),noteController.deleteController);
router.get<string>("/get/:noteId",requireUser,validate(getNoteSchema),noteController.getController)
router.get<string>("/getAll/:email",requireUser,validate(getAllNotesSchema),noteController.getAllController)
export default router;
