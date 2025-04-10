"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { Modal } from "@/components/Modal";
import Card from "@/components/Card";
import NavBar from "@/components/NavBar";
import { User, Task } from "@/types/type";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks/get-tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      alert("Failed to load tasks. Please try again.");
    }
  };

  // Initial setup and token validation
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decodedUser = jwtDecode<User>(token);
      setUser(decodedUser);
    } catch (error) {
      console.error("Invalid token:", error);
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [navigate]);

  const deleteTask = async (id: string) => {
    // Optimistically remove the task from the UI
    const taskToDelete = tasks.find((task) => task.id === id);
    setTasks(tasks.filter((task) => task.id !== id));

    try {
      await api.delete(`/tasks/delete-task/${id}`);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Revert the change on failure
      if (taskToDelete) {
        setTasks([...tasks, taskToDelete]);
      }
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    // Create a temporary task with a unique ID
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: Task = {
      id: tempId,
      userId: user?.id || "",
      title: newTask.title,
      description: newTask.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistically add the task to the UI
    setTasks([...tasks, optimisticTask]);
    closeModal();

    try {
      const response = await api.post("/tasks/create-task", {
        title: newTask.title,
        description: newTask.description,
      });
      const createdTask: Task = response.data.task;

      // Replace the temporary task with the actual one from the server
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === tempId ? createdTask : task))
      );
    } catch (error) {
      console.error("Failed to create task:", error);
      // Remove the optimistic task on failure
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempId));
      alert("Failed to create task. Please try again.");
    }
  };

  const openModal = () => {
    setNewTask({ title: "", description: "" }); // Reset form
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user!} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8 mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manage Your Tasks
              </h1>
              <p className="text-muted-foreground">
                Create, view, and organize your tasks all in one place.
              </p>
            </div>
            <button
              onClick={openModal}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 gap-1"
            >
              <Plus className="h-4 w-4" /> Create New Task
            </button>
          </div>

          {/* Task List */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id} task={task} deleteTask={deleteTask} />
            ))}
          </div>

          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="mt-20 flex flex-col items-center justify-center rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold">No tasks yet</h2>
              <p className="mt-2 text-muted-foreground">
                Create your first task to get started.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal for Adding New Task */}
      <Modal
        open={isModalOpen}
        escFn={closeModal}
        titleContent="Create New Task"
        content={
          <form className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm shadow-sm"
                placeholder="Enter task description"
                rows={4}
              />
            </div>
          </form>
        }
        actions={
          <>
            <button
              onClick={closeModal}
              className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTask}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newTask.title.trim()}
            >
              Save
            </button>
          </>
        }
      />
    </div>
  );
}
