"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { teamApi, Team } from "@/lib/api/team";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";

export default function TeamPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamApi.getAllTeams();
      setTeams(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

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
              <CreateTeamDialog onTeamCreated={fetchTeams} />
            </div>

            <div className="mb-6">
              <Input
                placeholder="Search team members..."
                className="max-w-md"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Loading teams...
              </div>
            ) : teams.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground space-y-3">
                <div>No teams found</div>
                <CreateTeamDialog onTeamCreated={fetchTeams} />
              </Card>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className="p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {team.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {team.description || "No description"}
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{team.members?.length ?? 0} members</span>
                          <span>{team.projects?.length ?? 0} projects</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
