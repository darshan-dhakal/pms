// "use client";

// import { useEffect, useState } from "react";
// import Sidebar from "@/components/dashboard/sidebar";
// import { ProtectedRoute } from "@/components/protected-route";
// import { useAuth } from "@/context/auth-context";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, Users, MoreVertical, Trash2, Edit } from "lucide-react";
// import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
// import { projectApi, Project } from "@/lib/api/project";
// import { useToast } from "@/hooks/use-toast";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function ProjectsPage() {
//   const { user } = useAuth();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const data = await projectApi.getAllProjects();
//       setProjects(data);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to fetch projects",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this project?")) return;

//     try {
//       await projectApi.deleteProject(id);
//       toast({
//         title: "Success",
//         description: "Project deleted successfully",
//       });
//       fetchProjects();
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to delete project",
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "COMPLETED":
//         return "bg-green-100 text-green-700";
//       case "IN_PROGRESS":
//         return "bg-blue-100 text-blue-700";
//       case "ON_HOLD":
//         return "bg-yellow-100 text-yellow-700";
//       case "PLANNING":
//         return "bg-purple-100 text-purple-700";
//       case "CANCELLED":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex h-screen bg-background">
//         <Sidebar user={user} />
//         <main className="flex-1 overflow-auto">
//           <div className="p-8">
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground mb-2">
//                   Projects
//                 </h1>
//                 <p className="text-muted-foreground">
//                   Manage and organize all your projects
//                 </p>
//               </div>
//               <CreateProjectDialog onProjectCreated={fetchProjects} />
//             </div>

//             {loading ? (
//               <div className="flex items-center justify-center h-64">
//                 <p className="text-muted-foreground">Loading projects...</p>
//               </div>
//             ) : projects.length === 0 ? (
//               <Card>
//                 <CardContent className="flex flex-col items-center justify-center h-64">
//                   <p className="text-muted-foreground mb-4">
//                     No projects found
//                   </p>
//                   <CreateProjectDialog onProjectCreated={fetchProjects} />
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {projects.map((project) => (
//                   <Card
//                     key={project.id}
//                     className="hover:shadow-lg transition-shadow"
//                   >
//                     <CardHeader>
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <CardTitle className="text-lg">
//                             {project.name}
//                           </CardTitle>
//                           {project.status && (
//                             <Badge
//                               className={`mt-2 ${getStatusColor(project.status)}`}
//                             >
//                               {project.status.replace("_", " ")}
//                             </Badge>
//                           )}
//                         </div>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon">
//                               <MoreVertical className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem>
//                               <Edit className="mr-2 h-4 w-4" />
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               className="text-red-600"
//                               onClick={() => handleDelete(project.id)}
//                             >
//                               <Trash2 className="mr-2 h-4 w-4" />
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                         {project.description}
//                       </p>
//                       <div className="space-y-2">
//                         {project.members !== undefined && (
//                           <div className="flex items-center text-sm text-muted-foreground">
//                             <Users className="mr-2 h-4 w-4" />
//                             {project.members} members
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";

import { useState } from "react";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectsList } from "@/components/projects/projects-list";
import Sidebar from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and organize all your projects
                </p>
              </div>
              <CreateProjectDialog onProjectCreated={handleProjectCreated} />
            </div>

            <ProjectsList refreshTrigger={refreshTrigger} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
