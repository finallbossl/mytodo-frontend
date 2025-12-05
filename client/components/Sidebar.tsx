import {
  CheckSquare2,
  Clock,
  Zap,
  ListTodo,
  Calendar,
  Clock3,
} from "lucide-react";
import { SidebarCategory } from "@/hooks/useTasks";

export type ViewMode = "board" | "weekly" | "daily";

interface SidebarProps {
  selectedCategory: SidebarCategory;
  onSelectCategory: (category: SidebarCategory) => void;
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
}

const categories = [
  { id: "all" as const, label: "All Tasks", icon: ListTodo },
  { id: "today" as const, label: "Today", icon: Clock },
  { id: "upcoming" as const, label: "Upcoming", icon: Zap },
  { id: "completed" as const, label: "Completed", icon: CheckSquare2 },
];

const viewModes = [
  { id: "board" as const, label: "Board", icon: ListTodo },
  { id: "weekly" as const, label: "Weekly", icon: Calendar },
  { id: "daily" as const, label: "Daily", icon: Clock3 },
];

export default function Sidebar({
  selectedCategory,
  onSelectCategory,
  viewMode,
  onSelectViewMode,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 hidden md:block flex flex-col overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase mb-3">
          Views
        </h3>
        <nav className="space-y-2">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onSelectViewMode(mode.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {viewMode === "board" && (
        <>
          <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase mb-3">
            Categories
          </h3>
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </nav>
        </>
      )}
    </aside>
  );
}
