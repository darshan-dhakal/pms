import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
}

export default function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span>{project.name}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}
          >
            {project.status}
          </span>
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
