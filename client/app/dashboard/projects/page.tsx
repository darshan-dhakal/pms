"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesign company website",
      status: "In Progress",
      members: 5,
    },
    {
      id: 2,
      name: "Mobile App",
      description: "Develop iOS and Android app",
      status: "Planning",
      members: 8,
    },
    {
      id: 3,
      name: "API Integration",
      description: "Integrate third-party APIs",
      status: "Completed",
      members: 3,
    },
  ]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Projects
                </h1>
                <p className="text-muted-foreground">
                  Manage and organize all your projects
                </p>
              </div>
              <Button className="bg-primary text-primary-foreground">
                + New Project
              </Button>
            </div>

            <div className="mb-6">
              <Input placeholder="Search projects..." className="max-w-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project.members} members
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-sm">
                      View
                    </Button>
                    <Button variant="outline" className="flex-1 text-sm">
                      Edit
                    </Button>
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
