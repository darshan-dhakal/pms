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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { projectApi, CreateProjectData } from "@/lib/api/project";
import { useToast } from "@/hooks/use-toast";
import { ComboBox, ComboBoxOption } from "../ui/combo-box";
import { teamApi } from "@/lib/api/team";

interface CreateProjectDialogProps {
  onProjectCreated: () => void;
}

export function CreateProjectDialog({
  onProjectCreated,
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamOptions, setTeamOptions] = useState<ComboBoxOption[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateProjectData>({
    name: "",
    teamId: "",
    description: "",
  });

  //fetch teams when dialog opens
  useEffect(() => {
    if (open) {
      fetchTeams();
    }
  }, [open]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const teams = await teamApi.getAllTeams();
      const teamOptions: ComboBoxOption[] = teams.map((team) => ({
        value: team.id,
        label: team.name,
      }));
      setTeamOptions(teamOptions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectApi.createProject(formData);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setOpen(false);
      setFormData({
        name: "",
        teamId: "",
        description: "",
      });
      onProjectCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your workspace. Fill in the details below.
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
                placeholder="Select a team"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
