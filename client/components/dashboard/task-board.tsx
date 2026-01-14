"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Task {
  id: number
  title: string
  assignee: string
  priority: "High" | "Medium" | "Low"
}

interface Column {
  title: string
  tasks: Task[]
}

export default function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      title: "To Do",
      tasks: [
        { id: 1, title: "Design landing page", assignee: "Sarah", priority: "High" },
        { id: 2, title: "Setup database", assignee: "John", priority: "High" },
      ],
    },
    {
      title: "In Progress",
      tasks: [
        { id: 3, title: "Implement authentication", assignee: "Mike", priority: "High" },
        { id: 4, title: "Create API endpoints", assignee: "Sarah", priority: "Medium" },
      ],
    },
    {
      title: "Review",
      tasks: [{ id: 5, title: "Code review", assignee: "Emma", priority: "Medium" }],
    },
    {
      title: "Done",
      tasks: [
        { id: 6, title: "Project setup", assignee: "John", priority: "Low" },
        { id: 7, title: "Team kickoff", assignee: "All", priority: "Medium" },
      ],
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((column) => (
        <div key={column.title} className="bg-secondary/50 rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-4">{column.title}</h3>
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <Card key={task.id} className="p-3 cursor-move hover:shadow-md transition">
                <p className="font-medium text-sm text-foreground mb-2">{task.title}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
