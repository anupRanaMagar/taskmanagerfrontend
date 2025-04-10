import { Trash2Icon } from "lucide-react";

interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface CardProps {
  task: Task;
  deleteTask: (id: string) => void;
}

export default function Card({ task, deleteTask }: CardProps) {
  const { title, description, id } = task;
  return (
    <div className="rounded-xl border-1 bg-card text-card-foreground shadow-lg transition-shadow hover:shadow-xl">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold leading-none tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      <div className="p-6">
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <div className="p-6 flex justify-end">
        <button
          onClick={() => deleteTask(id!)}
          className="bg-red-400 text-destructive-foreground hover:bg-destructive/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 gap-2 shadow-sm"
        >
          <Trash2Icon className="h-5 w-5" /> Delete
        </button>
      </div>
    </div>
  );
}
