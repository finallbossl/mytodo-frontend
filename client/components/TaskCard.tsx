import { Clock, Trash2 } from "lucide-react";
import { Task } from "@shared/api";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const tagColors = {
  Work: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Study: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Personal: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
};

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: TaskCardProps) {
  // Validate task exists
  if (!task) {
    return null;
  }

  // Get tag color with fallback
  const tagColor = tagColors[task.tag] || tagColors.Work;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Return original if invalid
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg p-5 transition-all hover:shadow-md ${
        task.completed ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-1 flex-shrink-0 w-6 h-6 rounded-md border-2 border-primary flex items-center justify-center transition-all hover:bg-primary/10 active:scale-90"
        >
          {task.completed && (
            <span className="text-primary font-bold text-lg">✓</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-foreground truncate ${
              task.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title || "Untitled Task"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description || ""}
          </p>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{task.time || "00:00"}</span>
              <span className="text-border">•</span>
              <span>{formatDate(task.date)}</span>
            </div>

            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${tagColor.bg} ${tagColor.text} ${tagColor.border}`}
            >
              {task.tag || "Work"}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors hover:bg-red-50 p-2 rounded-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
