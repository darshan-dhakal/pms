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
import { projectApi, Project, UpdateProjectData } from "@/lib/api/project";
import { useToast } from "@/hooks/use-toast";

interface EditProjectDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: () => void;
}

export function EditProjectDialog({
  projectId,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<UpdateProjectData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [originalData, setOriginalData] = useState<Project | null>(null);

  // Fetch project data when dialog opens
  useEffect(() => {
    if (open) {
      fetchProject();
    }
  }, [open, projectId]);

  const fetchProject = async () => {
    setFetching(true);
    try {
      const project = await projectApi.getProject(projectId);
      setFormData({
        name: project.name,
        description: project.description,
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
      });
      setOriginalData(project);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if data has changed
    if (
      formData.name === originalData?.name &&
      formData.description === originalData?.description &&
      formData.startDate ===
        (originalData?.startDate ? originalData.startDate.split("T")[0] : "") &&
      formData.endDate ===
        (originalData?.endDate ? originalData.endDate.split("T")[0] : "")
    ) {
      toast({
        title: "Info",
        description: "No changes made to the project",
      });
      return;
    }

    setLoading(true);

    try {
      await projectApi.updateProject(projectId, formData);
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
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading || fetching}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description (optional)"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading || fetching}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  disabled={loading || fetching}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  disabled={loading || fetching}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || fetching}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || fetching || !formData.name}
            >
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
