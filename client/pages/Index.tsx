import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import WeeklySchedule from "@/components/WeeklySchedule";
import DailySchedule from "@/components/DailySchedule";
import AddTaskModal from "@/components/AddTaskModal";
import { useTasks } from "@/hooks/useTasks";
import type { ViewMode } from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";

export default function Index() {
  const {
    tasks,
    selectedCategory,
    setSelectedCategory,
    addTask,
    toggleTask,
    deleteTask,
    searchTasks,
    isLoading,
    error,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("board");

  const handleAddTask = async (task: Parameters<typeof addTask>[0]) => {
    try {
      await addTask(task);
      setIsModalOpen(false);
      toast({
        title: "Task added",
        description: "Your task has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await toggleTask(id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    searchTasks(query);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </main>
      );
    }

    if (error) {
      return (
        <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-destructive mb-2">Failed to load tasks</p>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </main>
      );
    }

    switch (viewMode) {
      case "weekly":
        return <WeeklySchedule tasks={tasks} />;
      case "daily":
        return (
          <DailySchedule
            tasks={tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        );
      case "board":
      default:
        return (
          <TaskBoard
            tasks={tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        onAddClick={() => setIsModalOpen(true)}
        onSearch={handleSearch}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
        />

        {renderContent()}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
