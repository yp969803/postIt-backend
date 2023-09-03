import type { RouterContext } from "../deps.ts";
import { Note } from "../models/note.ts";
import omitFields from "../utils/omitfields.ts";
import { Bson } from "../deps.ts";
import { User } from "../models/user.ts";
import type { CreateNote, GetAllNotes, UpdateNote } from "../schema/note.ts";
import user from "./user.ts";

const createController = async (
  { state, request, response }: RouterContext<string>,
) => {
  try {
    const { title, description, tags }: CreateNote = await request.body()
      .value;

    const isNote = await Note.findOne({ title: title });
    if (isNote) {
      response.status = 401;
      response.body = {
        status: "fail",
        message: "Note with this title already exists",
      };
      return;
    }
    const user = await User.findOne({ _id: state.userId });

    if (!user) {
      response.status = 401;
      response.body = {
        status: "fail",
        message: "The user belonging to this token no longer exists",
      };
      return;
    }
    const createdAt = new Date();
    const updatedAt = createdAt;
    const email = user.email;
    const verified = user.verified;
    const noteId: string | Bson.ObjectId = await Note.insertOne({
      title,
      description,
      tags,
      email,
      verified,
      createdAt,
      updatedAt,
    });
    if (!noteId) {
      response.status = 500;
      response.body = { status: "error", message: "Error creating note" };
      return;
    }
    const note = await Note.findOne({ _id: noteId });
    response.status = 200;
    response.body = {
      status: "success",
      note: note,
    };
    return;
  } catch (error) {
    response.status = 500;
    response.body = {
      status: "success",
      message: error.message,
    };
    return;
  }
};

const updateController = async (
  { state, request, response, params }: RouterContext<string>,
) => {
  try {
    const { title, description, tags }: UpdateNote["body"] = await request
      .body()
      .value;

    const user = await User.findOne({ _id: state.userId });

    if (!user) {
      response.status = 401;
      response.body = {
        status: "fail",
        message: "The user belonging to this token no longer exists",
      };
      return;
    }

    const updatedInfo = await Note.updateOne(
      { _id: new Bson.ObjectId(params.todoId), email: user.email },
      {
        $set: {
          title: title,
          description: description,
          tags: tags,
          verified: user.verified,
          updatedAt: new Date(),
        },
      },
      { ignoreUndefined: true },
    );
    if (!updatedInfo.matchedCount) {
      response.status = 404;
      response.body = {
        status: "fail",
        message:
          "No Note with that Id exists or Only the creator of this note can edit this note",
      };
      return;
    }
    const updatedNote = await Note.findOne({ _id: updatedInfo.upsertedId });
    response.status = 200;
    response.body = {
      status: "success",
      data: { note: updatedNote },
    };

    return;
  } catch (error) {
    response.status = 500;
    response.body = {
      status: "success",
      message: error.message,
    };
    return;
  }
};

const deleteController = async ({
  params,
  state,
  response,
}: RouterContext<string>) => {
  try {
    const user = await User.findOne({ _id: state.userId });

    if (!user) {
      response.status = 401;
      response.body = {
        status: "fail",
        message: "The user belonging to this token no longer exists",
      };
      return;
    }
    const numberOfNote = await Note.deleteOne({
      _id: new Bson.ObjectId(params.noteId),
      email: user.email,
    });

    if (!numberOfNote) {
      response.status = 404;
      response.body = {
        status: "fail",
        message:
          "No note with that Id exists or only the creator of note can delete this note",
      };
      return;
    }

    response.status = 204;
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

const getController = async ({ params, response }: RouterContext<string>) => {
  try {
    const note = await Note.findOne({ _id: new Bson.ObjectId(params.noteId) });
    if (!note) {
      response.status = 404;
      response.body = {
        status: "success",
        message: "No note with that Id exists",
      };
      return;
    }
    response.status = 200;
    response.body = {
      status: "success",
      data: { note },
    };
    return;
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

const getAllController = async (
  { params, response }: RouterContext<string>,
) => {
  try {
    const all_notes = await Note.find({ email: params.email }).toArray();
    response.status = 200;
    response.body = {
      status: "success",
      data: { all_notes },
    };
    return;
  } catch (error) {
    response.status = 500;
    response.body = { status: "error", message: error.message };
    return;
  }
};

export default { getController,createController,updateController,deleteController,getAllController };