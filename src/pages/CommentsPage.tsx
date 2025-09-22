import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MessageSquare, User, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { EntityDrawer } from "@/components/shared/entity-drawer";

import type { TNewComment, TComment } from "../db/schema";
import { useComments } from "../hooks/use-comments";
import { useClients } from "../hooks/use-clients";

const commentFields = [
  {
    key: "userId",
    label: "Клиент",
    type: "select" as const,
    options: [], // будет заполнено динамически
  },
  {
    key: "comment",
    label: "Комментарий",
    type: "textarea" as const,
    placeholder: "Введите текст комментария"
  },
];

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<TComment | null>(null);
  const [newCommentData, setNewCommentData] = useState<TNewComment>({
    userId: 0,
    comment: "",
  });

  const {
    comments,
    isCommentsLoading,
    createComment,
    isCreateCommentLoading,
    deleteComment,
    updateComment,
    isUpdateCommentLoading,
    isDeleteCommentLoading,
    refetchComments,
  } = useComments(() => setIsAddDialogOpen(false));

  const { clients } = useClients(() => {});

  // @ts-ignore
  commentFields[0].options =
    clients?.map((client) => ({
      value: client.id.toString(),
      label: `${client.fullName} (${client.email})`,
    })) || [];

  let filteredComments: TComment[] = [];
  let totalComments = 0;
  let recentComments = 0; // за последние 7 дней

  if (comments) {
    filteredComments = comments.filter((comment: TComment) => {
      const matchesSearch = comment.comment
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesClient =
        clientFilter === "all" || comment.userId.toString() === clientFilter;

      return matchesSearch && matchesClient;
    });

    totalComments = comments.length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    recentComments = comments.filter(comment => 
      new Date(comment.createdAt) > weekAgo
    ).length;
  }

  const getClientInfo = (userId: number) => {
    const client = clients?.find((c) => c.id === userId);
    return client
      ? `${client.fullName} (${client.email})`
      : "Неизвестный клиент";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = () => {
    createComment(newCommentData);
    setNewCommentData({
      userId: 0,
      comment: "",
    });
  };

  const handleDeleteComment = () => {
    if (selectedComment) {
      deleteComment(selectedComment.id);
      setIsDrawerOpen(false);
      setSelectedComment(null);
    }
  };

  const handleRowClick = (comment: TComment) => {
    setSelectedComment({ ...comment });
    setIsDrawerOpen(true);
  };

  const handleSaveComment = () => {
    if (selectedComment) {
      updateComment({
        id: selectedComment.id,
        comment: {
          userId: selectedComment.userId,
          comment: selectedComment.comment,
        },
      });
      setIsDrawerOpen(false);
      setSelectedComment(null);
    }
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedComment(null);
      }, 150);
    }
  };

  const handleRefresh = () => {
    refetchComments();
  };

  if (isCommentsLoading && !comments) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">
            Загрузка комментариев...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Всего комментариев
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalComments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                За последнюю неделю
              </CardTitle>
              <Calendar className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {recentComments}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Действия
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Обновить
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Последнее обновление: сейчас
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Фильтры и поиск
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Найдите нужный комментарий
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Поиск по тексту комментария..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Все клиенты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все клиенты</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add Comment Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Создать новый комментарий</DialogTitle>
              <DialogDescription>
                Добавьте комментарий для клиента.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Клиент</Label>
                <Select
                  value={newCommentData.userId.toString()}
                  onValueChange={(value) =>
                    setNewCommentData({
                      ...newCommentData,
                      userId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem
                        key={client.id}
                        value={client.id.toString()}
                      >
                        {client.fullName} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий</Label>
                <textarea
                  id="comment"
                  placeholder="Введите текст комментария..."
                  value={newCommentData.comment}
                  onChange={(e) =>
                    setNewCommentData({
                      ...newCommentData,
                      comment: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] p-2 border rounded-md"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleAddComment}
                disabled={isCreateCommentLoading}
              >
                {isCreateCommentLoading
                  ? "Создание..."
                  : "Создать комментарий"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Список комментариев
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Найдено {filteredComments.length} комментариев из {comments?.length || 0}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать комментарий
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Комментарий</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map((comment: TComment) => (
                    <TableRow
                      key={comment.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(comment)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            #{comment.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {getClientInfo(comment.userId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-foreground line-clamp-2">
                          {comment.comment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(comment);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (comment.id) handleDeleteComment();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <EntityDrawer
        isOpen={isDrawerOpen}
        onOpenChange={handleCloseDrawer}
        entity={selectedComment}
        onEntityChange={setSelectedComment}
        onSave={handleSaveComment}
        onDelete={handleDeleteComment}
        isSaving={isUpdateCommentLoading}
        isDeleting={isDeleteCommentLoading}
        title="Редактирование комментария"
        description="Измените текст комментария и нажмите 'Сохранить'"
        fields={commentFields as any}
        additionalInfo={
          selectedComment && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                Дополнительная информация
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    ID комментария
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    #{selectedComment.id}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Дата создания
                  </Label>
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(selectedComment.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}