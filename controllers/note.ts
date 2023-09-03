import type { RouterContext } from '../deps.ts';
import { Note } from '../models/note.ts';
import omitFields from '../utils/omitfields.ts';
import type {CreateNote, UpdateNote, DeleteNote, GetNote,GetAllNotes } from "../schema/note.ts";
const createController = async ({ state, request ,response }: RouterContext<string>) => {
    try {
 
        
    
      const user = await Note.findOne({ title: state.userId });
  
      if (!user) {
        response.status = 401;
        response.body = {
          status: 'fail',
          message: 'The user belonging to this token no longer exists',
        };
        return;
      }
  
      response.status = 200;
      response.body = {
        status: 'success',
        user: omitFields(user, 'password'),
       
      };
    } catch (error) {
      response.status = 500;
      response.body = {
        status: 'success',
        message: error.message,
      };
      return;
    }
  };