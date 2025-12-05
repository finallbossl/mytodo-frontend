import TaskCard from "./TaskCard";
import { Task } from "@shared/api";

interface TaskBoardProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskBoard({
  tasks,
  onToggle,
  onDelete,
}: TaskBoardProps) {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-5xl">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No tasks yet
            </h2>
            <p className="text-muted-foreground">
              Create a new task to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
