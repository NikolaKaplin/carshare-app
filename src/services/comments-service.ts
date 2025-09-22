import { eq } from "drizzle-orm";
import { comments } from "../db/schema";

import { TNewComment, TUpdateComment } from "../db/schema";
import { DatabaseContextType } from "tauri-react-sqlite";

const returningId = (result: any) => {
  return result.lastInsertRowid as number;
};

export const commentsService = {
  async getComments({ db }: DatabaseContextType) {
    if (!db) throw new Error("Database not initialized");
    const allComments = await db.select().from(comments).orderBy(comments.createdAt);
    return allComments;
  },

  async getComment({ db }: DatabaseContextType, id: number) {
    if (!db) throw new Error("Database not initialized");
    const comment = await db.select().from(comments).where(eq(comments.id, id));
    return comment;
  },

  async createComment({ db }: DatabaseContextType, comment: TNewComment) {
    if (!db) throw new Error("Database not initialized");
    const newComment = returningId(await db.insert(comments).values(comment));
    const createdComment = await db.select().from(comments).where(eq(comments.id, newComment!));
    return createdComment;
  },

  async updateComment({ db }: DatabaseContextType, id: number, comment: TUpdateComment) {
    if (!db) throw new Error("Database not initialized");
    await db.update(comments).set(comment).where(eq(comments.id, id));
    const updatedComment = await db.select().from(comments).where(eq(comments.id, id));
    return updatedComment;
  },

  async deleteComment({ db }: DatabaseContextType, id: number) {
    if (!db) throw new Error("Database not initialized");
    const deletedComment = await db.select().from(comments).where(eq(comments.id, id));
    await db.delete(comments).where(eq(comments.id, id));
    return deletedComment;
  },
};