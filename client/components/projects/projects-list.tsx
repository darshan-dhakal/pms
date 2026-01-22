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
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectApi, Project } from "@/lib/api/project";
import { useToast } from "@/hooks/use-toast";
import { EditProjectDialog } from "./edit-project-dialog";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Archive,
  RefreshCw,
} from "lucide-react";

interface ProjectsListProps {
  refreshTrigger?: number;
}

// Define allowed status transitions
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["PLANNED", "ARCHIVED"],
  PLANNED: ["ACTIVE", "DRAFT", "ARCHIVED"],
  ACTIVE: ["ON_HOLD", "COMPLETED", "ARCHIVED"],
  ON_HOLD: ["ACTIVE", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  ARCHIVED: [],
};

const STATUS_OPTIONS = [
  "ALL",
  "DRAFT",
  "PLANNED",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "ARCHIVED",
];

export function ProjectsList({ refreshTrigger = 0 }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
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

  // const handleArchiveClick = async (projectId: string) => {
  //   if (!confirm("Are you sure you want to archive this project?")) {
  //     return;
  //   }

  //   try {
  //     await projectApi.archiveProject(projectId);
  //     toast({
  //       title: "Success",
  //       description: "Project archived successfully",
  //     });
  //     fetchProjects();
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description:
  //         error.response?.data?.message || "Failed to archive project",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleDeleteClick = async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
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

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      await projectApi.changeProjectStatus(
        projectId,
        newStatus as Project["status"],
      );
      toast({
        title: "Success",
        description: `Project status changed to ${newStatus}`,
      });
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to change project status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      PLANNED: "bg-blue-100 text-blue-800",
      ACTIVE: "bg-green-100 text-green-800",
      ON_HOLD: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-purple-100 text-purple-800",
      ARCHIVED: "bg-slate-100 text-slate-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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

  const filteredProjects = projects.filter((project) =>
    statusFilter === "ALL" ? true : project.status === statusFilter,
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          {filteredProjects.length} of {projects.length} projects
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ALL" ? "All" : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow
                key={project.id}
                className={project.isArchived ? "opacity-50" : ""}
              >
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {project.completedTasks}/{project.totalTasks}
                </TableCell>
                <TableCell>
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={project.isArchived}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditClick(project.id)}
                        className="cursor-pointer"
                        disabled={project.isArchived}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {!project.isArchived &&
                        ALLOWED_TRANSITIONS[project.status]?.length > 0 && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent sideOffset={6}>
                                {ALLOWED_TRANSITIONS[project.status]?.map(
                                  (status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onClick={() =>
                                        handleStatusChange(project.id, status)
                                      }
                                      className="cursor-pointer"
                                    >
                                      {status}
                                    </DropdownMenuItem>
                                  ),
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        )}
                      {/* <DropdownMenuItem
                        onClick={() => handleArchiveClick(project.id)}
                        className="cursor-pointer"
                        disabled={project.isArchived}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem> */}
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
      </div>

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
