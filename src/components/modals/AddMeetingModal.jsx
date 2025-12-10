import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useData } from '../../context/DataContext';
import { Video, Phone, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AddMeetingModal = ({ isOpen, onClose, selectedDate }) => {
  const { projects, addMilestone } = useData();
  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting', // meeting or call
    projectId: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '30',
    participants: '',
    location: '',
    notes: '',
    status: 'Upcoming'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const meetingData = {
      ...formData,
      title: `${formData.type === 'meeting' ? '👥' : '📞'} ${formData.title}`,
      description: `Time: ${formData.time} | Duration: ${formData.duration}min${formData.participants ? ' | Participants: ' + formData.participants : ''}${formData.location ? ' | Location: ' + formData.location : ''}${formData.notes ? ' | Notes: ' + formData.notes : ''}`,
    };
    
    addMilestone(meetingData);
    toast.success(`${formData.type === 'meeting' ? 'Meeting' : 'Call'} scheduled successfully!`);
    onClose();
    setFormData({
      title: '',
      type: 'meeting',
      projectId: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: '30',
      participants: '',
      location: '',
      notes: '',
      status: 'Upcoming'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Schedule {formData.type === 'meeting' ? 'Meeting' : 'Call'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'meeting' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === 'meeting'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Video className={`h-8 w-8 mx-auto mb-2 ${formData.type === 'meeting' ? 'text-teal-600' : 'text-slate-400'}`} />
              <p className="font-semibold text-slate-900">Meeting</p>
              <p className="text-xs text-slate-500 mt-1">In-person or video call</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'call' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === 'call'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Phone className={`h-8 w-8 mx-auto mb-2 ${formData.type === 'call' ? 'text-teal-600' : 'text-slate-400'}`} />
              <p className="font-semibold text-slate-900">Call</p>
              <p className="text-xs text-slate-500 mt-1">Phone or voice call</p>
            </button>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`e.g., Weekly Team Sync, Client ${formData.type === 'call' ? 'Call' : 'Meeting'}`}
              required
            />
          </div>

          <div>
            <Label htmlFor="projectId">Related Project</Label>
            <select
              id="projectId"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select project (optional)</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (min) *</Label>
              <select
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              placeholder="e.g., John, Sarah, Mike"
            />
            <p className="text-xs text-slate-500 mt-1">Separate names with commas</p>
          </div>

          {formData.type === 'meeting' && (
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Conference Room A, Zoom, Google Meet"
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes / Agenda</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add meeting agenda, discussion points, or call notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
              Schedule {formData.type === 'meeting' ? 'Meeting' : 'Call'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMeetingModal;
