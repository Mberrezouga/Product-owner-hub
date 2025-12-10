import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useData } from '../../context/DataContext';
import { Calendar, User, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  const { projects, updateTask, deleteTask } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task || {});

  // Update formData when task changes
  React.useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  if (!task) return null;

  const project = projects.find(p => p.id === task.projectId);

  const handleSave = () => {
    updateTask(task.id, formData);
    toast.success('Task updated successfully!');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      toast.success('Task deleted successfully!');
      onClose();
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-900">Task Details</DialogTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
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

        <div className="space-y-4 mt-4">
          {isEditing ? (
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          ) : (
            <h3 className="text-xl font-semibold text-slate-900">{task.title}</h3>
          )}

          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline">{task.status}</Badge>
            {project && (
              <Badge style={{ backgroundColor: project.color + '20', color: project.color }}>
                {project.name}
              </Badge>
            )}
          </div>

          <div>
            <Label>Description</Label>
            {isEditing ? (
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="text-slate-700 mt-1">{task.description || 'No description provided'}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">Deadline:</span>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="h-8 text-sm"
                />
              ) : (
                <span className="font-medium text-slate-900">
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">Assignee:</span>
              {isEditing ? (
                <Input
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="h-8 text-sm"
                />
              ) : (
                <span className="font-medium text-slate-900">{task.assignee || 'Unassigned'}</span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <Label>Priority</Label>
                <select
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
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;