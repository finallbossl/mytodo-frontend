import { Task } from "@shared/api";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

interface DailyScheduleProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DailySchedule({
  tasks,
  onToggle,
  onDelete,
}: DailyScheduleProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((task) => task.date === dateStr).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  };

  const dailyTasks = getTasksForDate(selectedDate);

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const goToPreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${String(i).padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getTasksAtTime = (timeSlot: string) => {
    return dailyTasks.filter((task) => task.time.startsWith(timeSlot.slice(0, 2)));
  };

  return (
    <main className="flex-1 p-6 overflow-auto bg-background">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Daily Schedule
            </h2>
            <p className="text-muted-foreground mt-1">
              {formatDateDisplay(selectedDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {dailyTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No tasks scheduled
            </h3>
            <p className="text-muted-foreground">
              Add a task for {formatDateDisplay(selectedDate).split(",")[0]}
            </p>
          </div>
        ) : (
          <div className="space-y-1 bg-card rounded-lg border border-border overflow-hidden">
            {timeSlots.map((timeSlot) => {
              const tasksAtTime = getTasksAtTime(timeSlot);
              const isCurrentHour =
                selectedDate === new Date().toISOString().split("T")[0] &&
                timeSlot ===
                  `${String(new Date().getHours()).padStart(2, "0")}:00`;

              return (
                <div key={timeSlot} className={isCurrentHour ? "bg-primary/5" : ""}>
                  <div className="flex items-stretch">
                    <div
                      className={`w-24 px-4 py-3 border-r border-border font-mono text-sm font-semibold flex items-center ${
                        isCurrentHour ? "text-primary bg-primary/10" : "text-muted-foreground"
                      }`}
                    >
                      {timeSlot}
                    </div>

                    <div className="flex-1 py-3 px-4">
                      {tasksAtTime.length === 0 ? (
                        <div className="h-12"></div>
                      ) : (
                        <div className="space-y-2">
                          {tasksAtTime.map((task) => {
                            const tagColor = tagColors[task.tag];
                            return (
                              <div
                                key={task.id}
                                className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                                  task.completed
                                    ? `${tagColor.bg} opacity-60`
                                    : `${tagColor.bg} border-l-4 border-l-current`
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <button
                                      onClick={() => onToggle(task.id)}
                                      className="mt-1 flex-shrink-0 w-5 h-5 rounded border border-current flex items-center justify-center transition-all hover:bg-current/10 active:scale-90"
                                    >
                                      {task.completed && (
                                        <span className="font-bold text-sm">✓</span>
                                      )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={`font-semibold ${tagColor.text} ${
                                          task.completed ? "line-through" : ""
                                        }`}
                                      >
                                        {task.title}
                                      </h4>
                                      <p className={`text-sm ${tagColor.text} opacity-75`}>
                                        {task.description}
                                      </p>
                                      <span
                                        className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${tagColor.text} bg-white/50 border ${tagColor.border}`}
                                      >
                                        {task.tag}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => onDelete(task.id)}
                                    className={`flex-shrink-0 p-2 rounded transition-colors ${tagColor.text} hover:bg-red-50 text-destructive`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
