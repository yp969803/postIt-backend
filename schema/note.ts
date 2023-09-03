import { z } from "../deps.ts";

export const createNoteSchema = z.object({
  body: z
    .object({
      title: z.string({ required_error: "title is required" }),
      description: z.string({required_error:"description is required"}),
      tags: z.string({required_error:"tags is required"})
    
    })
   
});

const params = {
    params: z.object({
      noteId: z.string(),
    }),
  };
  
const params2={
    params: z.object({
        email: z.string()
    })
}

export const updateNoteSchema = z.object({
    ...params,
    body: z
      .object({
        title: z.string(),
        description: z.string(),
        tags: z.string(),
      })
      .partial(),
});

export const deleteNoteSchema = z.object({
    ...params,
  });
  

export const getNoteSchema = z.object({
    ...params
}) 

export const getAllNotesSchema=z.object({
   ...params2
})



export type CreateNote = z.TypeOf<typeof createNoteSchema>["body"];
export type UpdateNote = z.TypeOf<typeof updateNoteSchema>;
export type DeleteNote= z.TypeOf<typeof deleteNoteSchema>["params"];
export type GetNote=z.TypeOf<typeof getNoteSchema>["params"];
export type GetAllNotes= z.TypeOf<typeof getAllNotesSchema>["params"]