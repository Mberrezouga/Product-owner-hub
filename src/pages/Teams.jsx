import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Users, Trash2, Edit, UserPlus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';

const Teams = () => {
  const { teams = [], addTeam, updateTeam, deleteTeam } = useData();
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: []
  });
  const [newMember, setNewMember] = useState({ name: '', role: 'Developer' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTeam) {
      updateTeam(editingTeam.id, formData);
      toast.success('Team updated successfully!');
    } else {
      addTeam(formData);
      toast.success('Team created successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', members: [] });
    setNewMember({ name: '', role: 'Developer' });
    setShowAddTeam(false);
    setEditingTeam(null);
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;
    
    setFormData({
      ...formData,
      members: [...formData.members, { ...newMember, id: Date.now().toString() }]
    });
    setNewMember({ name: '', role: 'Developer' });
  };

  const handleRemoveMember = (memberId) => {
    setFormData({
      ...formData,
      members: formData.members.filter(m => m.id !== memberId)
    });
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData(team);
    setShowAddTeam(true);
  };

  const handleDelete = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId);
      toast.success('Team deleted successfully!');
    }
  };

  const roles = [
    'Product Owner', 'Scrum Master', 'Tech Lead',
    'Senior Developer', 'Developer', 'Junior Developer',
    'Designer', 'QA Engineer', 'DevOps'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-600 mt-1">Create and manage teams to assign to projects</p>
        </div>
        <Button 
          onClick={() => setShowAddTeam(true)}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Add/Edit Team Form */}
      {showAddTeam && (
        <Card className="border-teal-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardTitle>{editingTeam ? 'Edit Team' : 'Create New Team'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Team Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Frontend Team, Backend Squad"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief team description"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">Team Members</label>
                  <Badge className="bg-teal-500 text-white">
                    {formData.members.length} members
                  </Badge>
                </div>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Member name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <Button type="button" onClick={handleAddMember} size="sm">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {formData.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => (
          <Card key={team.id} className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{team.name}</h3>
                    <p className="text-xs text-slate-500">{team.members?.length || 0} members</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(team)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(team.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {team.description && (
                <p className="text-sm text-slate-600 mb-4">{team.description}</p>
              )}

              <div className="space-y-2">
                {(team.members || []).slice(0, 3).map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-slate-700">{member.name}</span>
                    <span className="text-xs text-slate-500">• {member.role}</span>
                  </div>
                ))}
                {(team.members?.length || 0) > 3 && (
                  <p className="text-xs text-slate-500 ml-8">
                    +{team.members.length - 3} more members
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {teams.length === 0 && !showAddTeam && (
          <Card className="col-span-full border-dashed border-2 border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-4">No teams created yet</p>
              <Button 
                onClick={() => setShowAddTeam(true)}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Teams;
