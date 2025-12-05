import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onAddClick: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ onAddClick, onSearch }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-foreground">MyTasks</h1>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <Button
          onClick={onAddClick}
          className="bg-primary hover:bg-primary/90 text-white font-medium gap-2 flex items-center"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>
    </header>
  );
}
