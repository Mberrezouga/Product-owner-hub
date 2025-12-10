import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

const AddProjectModal = ({ isOpen, onClose }) => {
  const { addProject, teams = [] } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    status: 'Planning',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budgetPlanned: '',
    currency: 'USD',
    team: '',
    assignedTeam: '',
    assignedMembers: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Determine team members
    let teamMembers = [];
    if (formData.assignedTeam) {
      const team = teams.find(t => t.id === formData.assignedTeam);
      teamMembers = team ? team.members : [];
    } else if (formData.team) {
      teamMembers = formData.team.split(',').map(t => t.trim()).filter(t => t).map(name => ({
        name,
        role: 'Team Member',
        id: Date.now().toString() + Math.random()
      }));
    }
    
    const newProject = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      progress: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      currency: formData.currency,
      budget: {
        planned: parseInt(formData.budgetPlanned),
        actual: 0,
        categories: [
          { name: 'Development', planned: parseInt(formData.budgetPlanned) * 0.5, actual: 0 },
          { name: 'Design', planned: parseInt(formData.budgetPlanned) * 0.25, actual: 0 },
          { name: 'Testing', planned: parseInt(formData.budgetPlanned) * 0.15, actual: 0 },
          { name: 'Other', planned: parseInt(formData.budgetPlanned) * 0.1, actual: 0 }
        ]
      },
      team: teamMembers,
      assignedTeamId: formData.assignedTeam,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    addProject(newProject);
    toast.success('Project created successfully!');
    onClose();
    setFormData({
      name: '',
      description: '',
      priority: 'Medium',
      status: 'Planning',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budgetPlanned: '',
      currency: 'USD',
      team: '',
      assignedTeam: '',
      assignedMembers: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief project description"
                rows={3}
              />
            </div>

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
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="budgetPlanned">Budget Amount *</Label>
              <Input
                id="budgetPlanned"
                type="number"
                value={formData.budgetPlanned}
                onChange={(e) => setFormData({ ...formData, budgetPlanned: e.target.value })}
                placeholder="100000"
                required
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency *</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
                <option value="CNY">CNY - Chinese Yuan (¥)</option>
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="AUD">AUD - Australian Dollar (A$)</option>
                <option value="CAD">CAD - Canadian Dollar (C$)</option>
              </select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="assignedTeam">Assign Team (Optional)</Label>
              <select
                id="assignedTeam"
                value={formData.assignedTeam}
                onChange={(e) => {
                  const team = teams.find(t => t.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    assignedTeam: e.target.value,
                    assignedMembers: team ? team.members : []
                  });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select a team or add individual members below</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.members?.length || 0} members)
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="team">Or Add Individual Members</Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="John Doe, Jane Smith"
                disabled={!!formData.assignedTeam}
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.assignedTeam ? 'Team assigned - individual members disabled' : 'Separate names with commas'}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;