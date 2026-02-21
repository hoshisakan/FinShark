import apiService from "./ApiService";
import type { Comment } from "../Models/Stock";

interface CreateCommentPayload {
  stockId: number;
  title: string;
  content: string;
}

export const getAllComments = async (): Promise<Comment[]> => {
  const response = await apiService.get<Comment[]>("comment");
  return response.data;
};

export const createComment = async (payload: CreateCommentPayload): Promise<Comment> => {
  const response = await apiService.post<Comment>(`comment/${payload.stockId}`, {
    title: payload.title,
    content: payload.content,
  });

  return response.data;
};

export const deleteComment = async (id: number): Promise<void> => {
  await apiService.delete(`comment/${id}`);
};
