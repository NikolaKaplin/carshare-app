import { useQuery, useMutation, useQueryClient, usePrefetchQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { commentsService } from "../services/comments-service";
import { TComment, TNewComment, TUpdateComment } from "../db/schema";

import { useDatabase } from "tauri-react-sqlite";
import { customToast } from "@/components/shared/toast-custom";

export const useComments = (callback?: () => void) => {
  const queryClient = useQueryClient();
  const db = useDatabase();

  const { data: comments, isLoading: isCommentsLoading, refetch } = useQuery({
    queryKey: ["comments"],
    queryFn: () => commentsService.getComments(db),
    refetchInterval: 60000,
  });

  const prefetchComments = usePrefetchQuery({
    queryKey: ['comments'],
    queryFn: () => commentsService.getComments(db),
    staleTime: 60000,
  })

  const { mutate: createComment, isPending: isCreateCommentLoading } = useMutation({
    mutationKey: ["create comment"],
    mutationFn: (comment: TNewComment) => commentsService.createComment(db, comment),
    onMutate: async (newComment) => {
      customToast.loading("create comment", "Создание комментария...");
      
      // Отменяем исходящие запросы для избежания конфликтов
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      // Сохраняем предыдущее состояние для отката
      const previousComments = queryClient.getQueryData<TComment[]>(["comments"]);

      // Оптимистичное обновление
      queryClient.setQueryData<TComment[]>(["comments"], (oldData = []) => {
        const tempId = Date.now(); // Временный ID для оптимистичного обновления
        return [{ ...newComment, id: tempId, createdAt: new Date() } as TComment, ...oldData];
      });

      return { previousComments };
    },
    onSuccess: (newData) => {
      // При успешном создании обновляем данные с сервера
      queryClient.setQueryData<TComment[]>(["comments"], (oldData = []) => {
        // Удаляем временный элемент и добавляем реальный
        const filtered = oldData.filter(item => item.id !== newData[0].id);
        return [...newData, ...filtered];
      });
      customToast.success("create comment", "Комментарий успешно создан!");
      if (callback) callback();
    },
  });

  const { mutate: updateComment, isPending: isUpdateCommentLoading } = useMutation({
    mutationKey: ["update comment"],
    mutationFn: ({ id, comment }: { id: number; comment: TUpdateComment }) =>
      commentsService.updateComment(db, id, comment),
    onMutate: async ({ id, comment }) => {
      customToast.loading("update comment", "Обновление комментария...");
      
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousComments = queryClient.getQueryData<TComment[]>(["comments"]);

      // Оптимистичное обновление
      queryClient.setQueryData<TComment[]>(["comments"], (oldData = []) =>
        oldData.map((item) => item.id === id ? { ...item, ...comment } : item)
      );

      return { previousComments };
    },
    onSuccess: (newData, variables) => {
      // Обновляем конкретный элемент реальными данными
      queryClient.setQueryData<TComment[]>(["comments"], (oldData = []) =>
        oldData.map((item) => item.id === variables.id ? newData[0] : item)
      );
      customToast.success("update comment", "Комментарий успешно обновлен!");
    },
  });

  const { mutate: deleteComment, isPending: isDeleteCommentLoading } = useMutation({
    mutationKey: ["delete comment"],
    mutationFn: (id: number) => commentsService.deleteComment(db, id),
    onMutate: async (id) => {
      customToast.loading("delete comment", "Удаление комментария...");
      
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousComments = queryClient.getQueryData<TComment[]>(["comments"]);

      // Оптимистичное удаление
      queryClient.setQueryData<TComment[]>(["comments"], (oldData = []) =>
        oldData.filter((item) => item.id !== id)
      );

      return { previousComments };
    },
    onSuccess: () => {
      // Данные уже обновлены оптимистично, просто подтверждаем
      customToast.success("delete comment", "Комментарий успешно удален!");
    },
  });

  return useMemo(
    () => ({
      comments,
      isCommentsLoading,
      createComment,
      isCreateCommentLoading,
      updateComment,
      isUpdateCommentLoading,
      deleteComment,
      isDeleteCommentLoading,
      prefetchComments,
      refetchComments: refetch
    }),
    [
      comments,
      isCommentsLoading,
      createComment,
      isCreateCommentLoading,
      updateComment,
      isUpdateCommentLoading,
      deleteComment,
      isDeleteCommentLoading,
      prefetchComments,
      refetch
    ],
  );
};