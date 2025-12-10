import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { 
  FolderKanban, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Plus
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import AddProjectModal from '../components/modals/AddProjectModal';

const DashboardEnhanced = () => {
  const { projects, tasks } = useData();
  const [showAddProject, setShowAddProject] = useState(false);
  
  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const planning = projects.filter(p => p.status === 'Planning').length;
    
    const totalBudget = projects.reduce((sum, p) => sum + p.budget.planned, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.budget.actual, 0);
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    
    return {
      total,
      completed,
      inProgress,
      planning,
      totalBudget,
      totalSpent,
      budgetUtilization: Math.round((totalSpent / totalBudget) * 100),
      totalTasks,
      completedTasks,
      taskCompletionRate: Math.round((completedTasks / totalTasks) * 100)
    };
  };

  const stats = getProjectStats();
  
  const statCards = [
    { 
      title: 'Total Projects', 
      value: stats.total, 
      icon: FolderKanban, 
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: `${stats.inProgress} in progress, ${stats.completed} completed`
    },
    { 
      title: 'Budget Utilization', 
      value: `${stats.budgetUtilization}%`, 
      icon: DollarSign, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: `$${(stats.totalSpent / 1000).toFixed(0)}K of $${(stats.totalBudget / 1000).toFixed(0)}K spent`
    },
    { 
      title: 'Task Completion', 
      value: `${stats.taskCompletionRate}%`, 
      icon: CheckCircle2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.completedTasks} of ${stats.totalTasks} tasks done`
    },
    { 
      title: 'Active Sprint', 
      value: 'Sprint 14', 
      icon: Target, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: '13 days remaining'
    }
  ];

  // Budget Pie Chart Data
  const budgetData = [
    { name: 'Spent', value: stats.totalSpent, color: '#10b981' },
    { name: 'Remaining', value: stats.totalBudget - stats.totalSpent, color: '#e2e8f0' }
  ];

  // Project Status Bar Chart
  const projectStatusData = [
    { status: 'Completed', count: stats.completed, color: '#10b981' },
    { status: 'In Progress', count: stats.inProgress, color: '#14b8a6' },
    { status: 'Planning', count: stats.planning, color: '#3b82f6' }
  ];

  // Project Progress Data - limit to top 5 projects
  const projectTimelineData = projects
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      progress: p.progress || 0,
      color: p.color
    }));

  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const activeProjects = projects.filter(p => p.status === 'In Progress');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of all your projects and key metrics</p>
        </div>
        <Button 
          onClick={() => setShowAddProject(true)}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Pie Chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600">Spent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-sm text-slate-600">Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Bar Chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={projectStatusData}>
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Progress Chart */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {projectTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectTimelineData} layout="horizontal">
                  <XAxis 
                    type="number" 
                    domain={[0, 100]} 
                    tick={{ fontSize: 11 }}
                    label={{ value: 'Progress %', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11 }} 
                    width={100} 
                  />
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar 
                    dataKey="progress" 
                    fill="#10b981" 
                    radius={[0, 8, 8, 0]}
                    label={{ position: 'right', fontSize: 11, formatter: (value) => `${value}%` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                <p className="text-sm">No projects to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Active Projects</CardTitle>
              <Link to="/projects">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map(project => (
              <div key={project.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{project.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.priority === 'Critical' ? 'bg-red-100 text-red-700' : project.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {project.priority}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-semibold text-slate-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Due {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>${(project.budget.actual / 1000).toFixed(0)}K / ${(project.budget.planned / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Upcoming Deadlines</CardTitle>
              <Link to="/kanban">
                <Button variant="ghost" size="sm">View Board</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                const daysUntil = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntil <= 7;
                
                return (
                  <div key={task.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors">
                    <div className="flex items-start gap-3">
                      {isUrgent ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 text-sm">{task.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{project?.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                            {daysUntil} days
                          </span>
                          <span className="text-xs text-slate-600">{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddProjectModal isOpen={showAddProject} onClose={() => setShowAddProject(false)} />
    </div>
  );
};

export default DashboardEnhanced;