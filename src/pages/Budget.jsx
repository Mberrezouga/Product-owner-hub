import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { mockProjects } from '../mockData';

const Budget = () => {
  const [selectedProject, setSelectedProject] = useState('all');

  const calculateTotals = () => {
    const projects = selectedProject === 'all' 
      ? mockProjects 
      : mockProjects.filter(p => p.id === selectedProject);

    const totalPlanned = projects.reduce((sum, p) => sum + p.budget.planned, 0);
    const totalActual = projects.reduce((sum, p) => sum + p.budget.actual, 0);
    const variance = totalActual - totalPlanned;
    const utilizationRate = Math.round((totalActual / totalPlanned) * 100);

    return { totalPlanned, totalActual, variance, utilizationRate };
  };

  const totals = calculateTotals();

  const getCategoryTotals = () => {
    const projects = selectedProject === 'all' 
      ? mockProjects 
      : mockProjects.filter(p => p.id === selectedProject);

    const categoryMap = {};
    
    projects.forEach(project => {
      project.budget.categories.forEach(cat => {
        if (!categoryMap[cat.name]) {
          categoryMap[cat.name] = { planned: 0, actual: 0 };
        }
        categoryMap[cat.name].planned += cat.planned;
        categoryMap[cat.name].actual += cat.actual;
      });
    });

    return Object.entries(categoryMap).map(([name, values]) => ({
      name,
      planned: values.planned,
      actual: values.actual,
      utilization: Math.round((values.actual / values.planned) * 100)
    })).sort((a, b) => b.actual - a.actual);
  };

  const categoryData = getCategoryTotals();
  const maxCategory = Math.max(...categoryData.map(c => c.planned));

  const getBudgetStatus = (utilization) => {
    if (utilization > 90) return { color: 'text-red-600', bg: 'bg-red-50', status: 'Over Budget Risk' };
    if (utilization > 75) return { color: 'text-amber-600', bg: 'bg-amber-50', status: 'High Utilization' };
    return { color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'On Track' };
  };

  const overallStatus = getBudgetStatus(totals.utilizationRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Budget Tracker</h1>
          <p className="text-slate-600 mt-1">Monitor spending and budget utilization</p>
        </div>
        <select 
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Projects</option>
          {mockProjects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Budget</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  ${(totals.totalPlanned / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Actual Spent</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  ${(totals.totalActual / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Remaining</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  ${((totals.totalPlanned - totals.totalActual) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className={`w-12 h-12 ${overallStatus.bg} rounded-lg flex items-center justify-center`}>
                <DollarSign className={`h-6 w-6 ${overallStatus.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Utilization</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {totals.utilizationRate}%
                </p>
                <Badge className={`mt-2 ${overallStatus.bg} ${overallStatus.color}`}>
                  {overallStatus.status}
                </Badge>
              </div>
              <div className={`w-12 h-12 ${overallStatus.bg} rounded-lg flex items-center justify-center`}>
                <PieChart className={`h-6 w-6 ${overallStatus.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget by Category */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Budget by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categoryData.map(category => {
              const status = getBudgetStatus(category.utilization);
              const barWidth = (category.planned / maxCategory) * 100;
              const actualWidth = (category.actual / category.planned) * 100;
              
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{category.name}</h4>
                      <Badge className={`${status.bg} ${status.color} text-xs`}>
                        {category.utilization}%
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        ${(category.actual / 1000).toFixed(0)}K
                      </span>
                      {' / '}
                      ${(category.planned / 1000).toFixed(0)}K
                    </div>
                  </div>
                  
                  {/* Budget Bar */}
                  <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                    {/* Planned Budget (background) */}
                    <div 
                      className="absolute h-full bg-slate-200 rounded-lg"
                      style={{ width: `${barWidth}%` }}
                    />
                    {/* Actual Spent (foreground) */}
                    <div 
                      className="absolute h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg transition-all duration-500"
                      style={{ width: `${(barWidth * actualWidth) / 100}%` }}
                    />
                    {/* Labels */}
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className="text-xs font-medium text-white drop-shadow-md">
                        Actual
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        Planned
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Project Budget Breakdown */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Project Budget Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(selectedProject === 'all' ? mockProjects : mockProjects.filter(p => p.id === selectedProject))
              .map(project => {
                const utilization = Math.round((project.budget.actual / project.budget.planned) * 100);
                const status = getBudgetStatus(utilization);
                
                return (
                  <div key={project.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1 h-12 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900">{project.name}</h4>
                          <p className="text-sm text-slate-600">{project.status}</p>
                        </div>
                      </div>
                      <Badge className={`${status.bg} ${status.color}`}>
                        {status.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 ml-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Budget Utilization</span>
                        <span className="font-semibold text-slate-900">{utilization}%</span>
                      </div>
                      <Progress value={utilization} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Spent: ${(project.budget.actual / 1000).toFixed(0)}K</span>
                        <span>Planned: ${(project.budget.planned / 1000).toFixed(0)}K</span>
                        <span>Remaining: ${((project.budget.planned - project.budget.actual) / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budget;