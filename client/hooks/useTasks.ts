import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, type Task, type CreateTaskDto } from "@shared/api";

export type { Task };
export type SidebarCategory = "all" | "today" | "upcoming" | "completed";

export const useTasks = () => {
  const [selectedCategory, setSelectedCategory] = useState<SidebarCategory>(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  // Fetch tasks with category and search filters
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", selectedCategory, searchQuery],
    queryFn: () => taskApi.getTasks(selectedCategory === "all" ? undefined : selectedCategory, searchQuery || undefined),
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (task: CreateTaskDto) => taskApi.createTask(task),
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Toggle task mutation
  const toggleTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      await createTaskMutation.mutateAsync({
        title: task.title,
        description: task.description,
        tag: task.tag,
        date: task.date,
        time: task.time,
      });
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      await toggleTaskMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  const searchTasks = (query: string) => {
    setSearchQuery(query);
    // The query will automatically refetch with the new search query
    return tasks;
  };

  return {
    tasks,
    selectedCategory,
    setSelectedCategory,
    addTask,
    toggleTask,
    deleteTask,
    searchTasks,
    isLoading,
    error,
  };
};
