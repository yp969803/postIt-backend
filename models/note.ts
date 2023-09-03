import { db } from "../utils/connectDB.ts";
import { ObjectId } from "../deps.ts";

interface NoteSchema {
  _id?: ObjectId;
  title: string;
  email: string;
  description: string;
  tags:string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Note = db.collection<NoteSchema>("notes");
Note.createIndexes({indexes:[{name: "unique_title", key: {"title": 1}, unique: true}]})