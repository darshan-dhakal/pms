"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design landing page",
      project: "Website Redesign",
      assignee: "Sarah",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-02-01",
    },
    {
      id: 2,
      title: "Setup database",
      project: "Website Redesign",
      assignee: "John",
      priority: "High",
      status: "To Do",
      dueDate: "2026-01-25",
    },
    {
      id: 3,
      title: "Implement authentication",
      project: "Mobile App",
      assignee: "Mike",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-01-28",
    },
    {
      id: 4,
      title: "Create API endpoints",
      project: "Mobile App",
      assignee: "Sarah",
      priority: "Medium",
      status: "To Do",
      dueDate: "2026-02-05",
    },
    {
      id: 5,
      title: "Code review",
      project: "API Integration",
      assignee: "Emma",
      priority: "Medium",
      status: "Review",
      dueDate: "2026-01-20",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Review":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Tasks
                </h1>
                <p className="text-muted-foreground">
                  Track and manage your tasks
                </p>
              </div>
              <Button className="bg-primary text-primary-foreground">
                + New Task
              </Button>
            </div>

            <div className="mb-6">
              <Input placeholder="Search tasks..." className="max-w-md" />
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {task.project}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Assignee
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {task.assignee}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Due Date
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {task.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
