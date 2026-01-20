"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectApi } from "@/lib/api/project";
import { useToast } from "@/hooks/use-toast";
import { EditProjectDialog } from "./edit-project-dialog";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  team?: { id: string; name: string };
  createdAt: string;
}

interface ProjectsListProps {
  refreshTrigger?: number;
}

export function ProjectsList({ refreshTrigger = 0 }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectApi.getAllProjects();
      setProjects(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (projectId: string) => {
    setEditingProjectId(projectId);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await projectApi.deleteProject(projectId);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found. Create one to get started!
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.team?.name || "N/A"}</TableCell>
              <TableCell>
                {new Date(project.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditClick(project.id)}
                      className="cursor-pointer"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(project.id)}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingProjectId && (
        <EditProjectDialog
          projectId={editingProjectId}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onProjectUpdated={() => {
            fetchProjects();
            setEditingProjectId(null);
          }}
        />
      )}
    </>
  );
}
