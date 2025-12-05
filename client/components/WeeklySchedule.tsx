import { Task } from "@shared/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface WeeklyScheduleProps {
  tasks: Task[];
}

export default function WeeklySchedule({ tasks }: WeeklyScheduleProps) {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    return start;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((task) => task.date === dateStr);
  };

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const tagColors = {
    Work: "bg-blue-100 text-blue-700",
    Study: "bg-purple-100 text-purple-700",
    Personal: "bg-green-100 text-green-700",
  };

  const goToPreviousWeek = () => {
    setStartDate(
      (prev) => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000)
    );
  };

  const goToNextWeek = () => {
    setStartDate(
      (prev) => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    setStartDate(start);
  };

  return (
    <main className="flex-1 p-6 overflow-auto bg-background">
      <div className="max-w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Weekly Schedule
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToCurrentWeek}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, idx) => {
            const tasksForDay = getTasksForDate(date);
            const isToday =
              date.toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0];

            return (
              <div
                key={idx}
                className={`rounded-lg border ${
                  isToday
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                } p-4 min-h-96 flex flex-col`}
              >
                <div className="mb-4">
                  <div className="text-sm font-semibold text-foreground">
                    {formatDay(date)}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      isToday ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {formatDateHeader(date)}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {tasksForDay.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No tasks
                    </p>
                  ) : (
                    tasksForDay.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2 rounded text-xs bg-card border border-border hover:shadow-sm transition-shadow ${
                          task.completed ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`flex-shrink-0 w-3 h-3 rounded border border-primary mt-0.5 ${
                              task.completed ? "bg-primary" : ""
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium text-foreground truncate ${
                                task.completed ? "line-through" : ""
                              }`}
                            >
                              {task.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {task.time}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded ${
                              tagColors[task.tag]
                            }`}
                          >
                            {task.tag}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
