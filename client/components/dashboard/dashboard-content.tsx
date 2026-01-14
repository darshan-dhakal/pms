"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ProjectCard from "./project-card"
import TaskBoard from "./task-board"

export default function DashboardContent({ user }: { user: any }) {
  const [projects, setProjects] = useState([
    { id: 1, name: "Website Redesign", description: "Complete UI overhaul", status: "In Progress", progress: 65 },
    { id: 2, name: "Mobile App", description: "iOS and Android app", status: "Planning", progress: 25 },
    { id: 3, name: "API Development", description: "REST API backend", status: "In Progress", progress: 80 },
  ])

  const [showNewProject, setShowNewProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      setProjects([
        ...projects,
        {
          id: projects.length + 1,
          name: newProjectName,
          description: "New project",
          status: "Planning",
          progress: 0,
        },
      ])
      setNewProjectName("")
      setShowNewProject(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{projects.length}</p>
              <p className="text-sm text-muted-foreground mt-2">Active Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground mt-2">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">8</p>
              <p className="text-sm text-muted-foreground mt-2">Team Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">57%</p>
              <p className="text-sm text-muted-foreground mt-2">Overall Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
          <Button onClick={() => setShowNewProject(!showNewProject)}>
            {showNewProject ? "Cancel" : "+ New Project"}
          </Button>
        </div>

        {showNewProject && (
          <Card className="mb-4 p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
              />
              <Button onClick={handleAddProject}>Create</Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Task Board</h2>
        <TaskBoard />
      </div>
    </div>
  )
}
