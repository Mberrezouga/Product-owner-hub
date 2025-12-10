import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useData } from '../../context/DataContext';
import { toast } from 'sonner';

const AddEventModal = ({ isOpen, onClose }) => {
  const { projects, addMilestone } = useData();
  const [formData, setFormData] = useState({
    title: '',
    projectId: '',
    date: '',
    status: 'Upcoming'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addMilestone(formData);
    toast.success('Event/Milestone created successfully!');
    onClose();
    setFormData({
      title: '',
      projectId: '',
      date: '',
      status: 'Upcoming'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Add Event/Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter event or milestone name"
              required
            />
          </div>

          <div>
            <Label htmlFor="projectId">Related Project *</Label>
            <select
              id="projectId"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
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
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;