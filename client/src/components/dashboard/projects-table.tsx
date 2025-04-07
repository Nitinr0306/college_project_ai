import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Globe, 
  ShoppingCart, 
  FileText, 
  MoreVertical, 
  ChevronUp, 
  ArrowRight,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useCarbonAnalysis, Project } from "@/hooks/use-carbonapi";
import { formatDistanceToNow } from 'date-fns';

export default function ProjectsTable() {
  const { useProjects } = useCarbonAnalysis();
  const { data: projects, isLoading, error } = useProjects();
  const { toast } = useToast();

  // Map project status to badge styles
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'optimized':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Optimized</Badge>;
      case 'in progress':
      case 'analyzed':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'new':
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-800">New</Badge>;
      default:
        return <Badge variant="outline" className="bg-neutral-100 text-neutral-800">{status}</Badge>;
    }
  };

  // Get icon based on project name/url
  const getProjectIcon = (project: Project, index: number) => {
    // Use a deterministic approach based on the project properties
    const iconType = (project.name.length + index) % 3;
    
    switch (iconType) {
      case 0:
        return <Globe className="text-primary-600 text-sm" size={16} />;
      case 1:
        return <ShoppingCart className="text-secondary-600 text-sm" size={16} />;
      case 2:
        return <FileText className="text-blue-600 text-sm" size={16} />;
      default:
        return <Globe className="text-primary-600 text-sm" size={16} />;
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'unknown time ago';
    }
  };

  const handleViewDetails = (projectId: number) => {
    toast({
      title: "Opening project details",
      description: `Navigating to project #${projectId} details...`,
    });
    // Would typically navigate to a project details page
  };

  const handleEditProject = (projectId: number) => {
    toast({
      title: "Edit project",
      description: `Opening editor for project #${projectId}...`,
    });
  };

  const handleDeleteProject = (projectId: number) => {
    toast({
      title: "Delete project?",
      description: "This action cannot be undone.",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-white border border-neutral-200 rounded-xl">
        <CardHeader className="flex justify-between items-center pb-0">
          <CardTitle className="text-lg font-medium text-neutral-800">Recent Projects</CardTitle>
          <Skeleton className="h-6 w-16" />
        </CardHeader>
        <CardContent className="p-0 mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Project</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Last Update</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-neutral-200">
                    <td className="py-3 px-4">
                      <Skeleton className="h-12 w-40" />
                    </td>
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-20" />
                    </td>
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-12" />
                    </td>
                    <td className="py-3 px-4">
                      <Skeleton className="h-6 w-24" />
                    </td>
                    <td className="py-3 px-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !projects) {
    return (
      <Card className="bg-white border border-neutral-200 rounded-xl">
        <CardContent className="p-6">
          <div className="text-red-500">
            Error loading projects: {error?.message || "Failed to load projects"}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort projects by updatedAt date (most recent first)
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <Card className="bg-white border border-neutral-200 rounded-xl">
      <CardHeader className="flex flex-row justify-between items-center pb-0">
        <CardTitle className="text-lg font-medium text-neutral-800">Recent Projects</CardTitle>
        <Link href="/carbon-estimator" className="text-primary-600 text-sm hover:text-primary-700 transition-colors flex items-center">
          View all
          <ArrowRight className="ml-1" size={14} />
        </Link>
      </CardHeader>
      <CardContent className="p-0 mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Project</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Last Update</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.slice(0, 5).map((project, index) => (
                <tr key={project.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center mr-3">
                        {getProjectIcon(project, index)}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800">{project.name}</div>
                        <div className="text-sm text-neutral-500">{project.url}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="font-medium text-neutral-800 mr-2">{project.sustainabilityScore || "--"}</span>
                      {project.sustainabilityScore && project.sustainabilityScore > 50 && (
                        <ChevronUp className="text-green-500 text-sm" size={16} />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-500">
                    {formatRelativeTime(project.updatedAt)}
                  </td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-neutral-600">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(project.id)}>
                          <Eye className="mr-2" size={16} />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                          <Edit className="mr-2" size={16} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2" size={16} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    No projects yet. Start by analyzing a website in the Carbon Estimator.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
