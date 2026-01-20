"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectApi, CreateProjectData } from "@/lib/api/project";
import { useToast } from "@/hooks/use-toast";
import { ComboBox, ComboBoxOption } from "../ui/combo-box";
import { teamApi } from "@/lib/api/team";

interface EditProjectDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: () => void;
}

interface Project {
  id: string;
  name: string;
  description: string;
  teamId: string;
}

export function EditProjectDialog({
  projectId,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamOptions, setTeamOptions] = useState<ComboBoxOption[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateProjectData>({
    name: "",
    teamId: "",
    description: "",
  });
  const [originalData, setOriginalData] = useState<Project | null>(null);

  // Fetch teams and project data when dialog opens
  useEffect(() => {
    if (open) {
      fetchTeamsAndProject();
    }
  }, [open]);

  const fetchTeamsAndProject = async () => {
    setLoading(true);
    try {
      // Fetch teams
      const teams = await teamApi.getAllTeams();
      const teamOptions: ComboBoxOption[] = teams.map((team) => ({
        value: team.id,
        label: team.name,
      }));
      setTeamOptions(teamOptions);

      // Fetch project details
      const project = await projectApi.getProject(projectId);
      setFormData({
        name: project.name,
        teamId: project.teamId,
        description: project.description,
      });
      setOriginalData(project);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if data has changed
    if (
      formData.name === originalData?.name &&
      formData.description === originalData?.description &&
      formData.teamId === originalData?.teamId
    ) {
      toast({
        title: "Info",
        description: "No changes made to the project",
      });
      return;
    }

    setLoading(true);

    try {
      await projectApi.updateProject(Number(projectId), formData);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      onOpenChange(false);
      onProjectUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                required
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team">Select Team *</Label>
              <ComboBox
                options={teamOptions}
                value={formData.teamId}
                onChange={(value) =>
                  setFormData({ ...formData, teamId: value })
                }
                placeholder={
                  loadingTeams ? "Loading teams..." : "Select a team"
                }
                searchPlaceholder="Search teams..."
                emptyMessage={
                  loadingTeams ? "Loading..." : "No teams available"
                }
                disabled={loading || teamOptions.length === 0}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.teamId}>
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
