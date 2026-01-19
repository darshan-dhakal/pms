"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Project Manager",
      status: "Active",
      joinDate: "2025-10-15",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "Backend Developer",
      status: "Active",
      joinDate: "2025-11-01",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      role: "Frontend Developer",
      status: "Active",
      joinDate: "2025-11-15",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "QA Engineer",
      status: "Active",
      joinDate: "2025-12-01",
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      email: "alex@example.com",
      role: "DevOps Engineer",
      status: "Invited",
      joinDate: "2026-01-10",
    },
  ]);

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      "Project Manager": "bg-purple-100 text-purple-700",
      "Backend Developer": "bg-blue-100 text-blue-700",
      "Frontend Developer": "bg-green-100 text-green-700",
      "QA Engineer": "bg-orange-100 text-orange-700",
      "DevOps Engineer": "bg-red-100 text-red-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
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
                  Team
                </h1>
                <p className="text-muted-foreground">
                  Manage team members and collaborators
                </p>
              </div>
              <Button className="bg-primary text-primary-foreground">
                + Invite Member
              </Button>
            </div>

            <div className="mb-6">
              <Input
                placeholder="Search team members..."
                className="max-w-md"
              />
            </div>

            <div className="space-y-4">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {member.email}
                      </p>
                      <div className="flex gap-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${getRoleColor(member.role)}`}
                        >
                          {member.role}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${getStatusColor(member.status)}`}
                        >
                          {member.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-4">
                        Joined
                      </p>
                      <p className="text-sm font-medium text-foreground mb-4">
                        {member.joinDate}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
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
