import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useData } from '../../context/DataContext';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Trash2, 
  Save, 
  Plus,
  X,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { toast } from 'sonner';

const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  const { updateProject, deleteProject, tasks } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(project || {});
  const [newMember, setNewMember] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Developer');

  // Update formData when project changes
  React.useEffect(() => {
    if (project) {
      // Ensure budget structure exists
      const safeProject = {
        ...project,
        budget: project.budget || {
          planned: 0,
          actual: 0,
          categories: []
        },
        team: project.team || []
      };
      setFormData(safeProject);
      setIsEditing(false);
    }
  }, [project]);

  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;

  const handleSave = () => {
    updateProject(project.id, formData);
    toast.success('Project updated successfully!');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This will not delete associated tasks.')) {
      deleteProject(project.id);
      toast.success('Project deleted successfully!');
      onClose();
    }
  };

  const handleAddMember = () => {
    if (!newMember.trim()) return;
    
    const updatedTeam = formData.team || [];
    const memberWithRole = {
      name: newMember.trim(),
      role: newMemberRole,
      id: Date.now().toString()
    };
    
    setFormData({
      ...formData,
      team: [...updatedTeam, memberWithRole]
    });
    setNewMember('');
    setNewMemberRole('Developer');
  };

  const handleRemoveMember = (index) => {
    const updatedTeam = [...(formData.team || [])];
    updatedTeam.splice(index, 1);
    setFormData({
      ...formData,
      team: updatedTeam
    });
  };

  const updateBudget = (category, field, value) => {
    if (!formData.budget || !formData.budget.categories) return;
    
    const updatedCategories = formData.budget.categories.map(cat =>
      cat.name === category ? { ...cat, [field]: parseFloat(value) || 0 } : cat
    );
    const totalPlanned = updatedCategories.reduce((sum, cat) => sum + (cat.planned || 0), 0);
    const totalActual = updatedCategories.reduce((sum, cat) => sum + (cat.actual || 0), 0);
    
    setFormData({
      ...formData,
      budget: {
        ...formData.budget,
        planned: totalPlanned,
        actual: totalActual,
        categories: updatedCategories
      }
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-700',
      'High': 'bg-amber-100 text-amber-700',
      'Medium': 'bg-blue-100 text-blue-700',
      'Low': 'bg-slate-100 text-slate-700'
    };
    return colors[priority] || colors['Medium'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-emerald-100 text-emerald-700',
      'In Progress': 'bg-teal-100 text-teal-700',
      'Planning': 'bg-blue-100 text-blue-700',
      'On Hold': 'bg-slate-100 text-slate-700'
    };
    return colors[status] || colors['Planning'];
  };

  // Ensure team is always an array
  const team = Array.isArray(formData.team) 
    ? formData.team 
    : (formData.team || []).map(name => ({ name, role: 'Team Member', id: Math.random().toString() }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              {isEditing ? 'Edit Project' : 'Project Details'}
            </DialogTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData(project);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="bg-teal-500 text-white hover:bg-teal-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <div 
                      className="w-1 h-8 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    {project.name}
                  </h3>
                  <p className="text-slate-600 mt-2">{project.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Overall Progress</span>
                    <span className="font-bold text-slate-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                  <p className="text-xs text-slate-500">
                    {completedTasks} of {projectTasks.length} tasks completed
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Timeline</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Budget Used</p>
                      <p className="text-sm font-semibold text-slate-900">
                        ${(project.budget.actual / 1000).toFixed(0)}K / ${(project.budget.planned / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
                {isEditing && (
                  <Badge className="bg-teal-500 text-white">
                    {team.length} members
                  </Badge>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <Input
                    placeholder="Member name"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Product Owner">Product Owner</option>
                    <option value="Scrum Master">Scrum Master</option>
                    <option value="Tech Lead">Tech Lead</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Developer">Developer</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                  <Button
                    onClick={handleAddMember}
                    className="bg-teal-500 hover:bg-teal-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                {team.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No team members yet</p>
                  </div>
                ) : (
                  team.map((member, index) => {
                    const memberName = typeof member === 'string' ? member : member.name;
                    const memberRole = typeof member === 'string' ? 'Team Member' : member.role;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-teal-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-sm font-semibold text-white">
                            {memberName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{memberName}</p>
                            <p className="text-xs text-slate-500">{memberRole}</p>
                          </div>
                        </div>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Team Hierarchy Visualization */}
              {team.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Team Hierarchy</h4>
                  <div className="space-y-2">
                    {['Product Owner', 'Scrum Master', 'Tech Lead', 'Senior Developer', 'Developer', 'Junior Developer', 'Designer', 'QA Engineer', 'DevOps'].map(role => {
                      const members = team.filter(m => (typeof m === 'string' ? 'Team Member' : m.role) === role);
                      if (members.length === 0) return null;
                      return (
                        <div key={role} className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-slate-700 min-w-[140px]">{role}:</span>
                          <div className="flex gap-1 flex-wrap">
                            {members.map((m, i) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {typeof m === 'string' ? m : m.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Total Planned</p>
                  <p className="text-2xl font-bold text-blue-900">${((formData.budget?.planned || 0) / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-emerald-900">${((formData.budget?.actual || 0) / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-600 font-medium">Remaining</p>
                  <p className="text-2xl font-bold text-amber-900">${(((formData.budget?.planned || 0) - (formData.budget?.actual || 0)) / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Budget by Category</h4>
                {(formData.budget?.categories || []).map((category, index) => {
                  const utilization = Math.round((category.actual / category.planned) * 100);
                  return (
                    <div key={index} className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{category.name}</span>
                        <Badge className={utilization > 85 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}>
                          {utilization}%
                        </Badge>
                      </div>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Planned</Label>
                            <Input
                              type="number"
                              value={category.planned}
                              onChange={(e) => updateBudget(category.name, 'planned', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Actual</Label>
                            <Input
                              type="number"
                              value={category.actual}
                              onChange={(e) => updateBudget(category.name, 'actual', e.target.value)}
                              className="h-8"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Progress value={utilization} className="h-2 mb-2" />
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Spent: ${(category.actual / 1000).toFixed(0)}K</span>
                            <span>Budget: ${(category.planned / 1000).toFixed(0)}K</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
