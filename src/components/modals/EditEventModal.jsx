import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useData } from '../../context/DataContext';
import { Trash2, Save, Video, Phone, Target } from 'lucide-react';
import { toast } from 'sonner';

const EditEventModal = ({ event, isOpen, onClose }) => {
  const { projects, updateMilestone, deleteMilestone, teams = [] } = useData();
  const [formData, setFormData] = useState({
    title: '',
    type: 'milestone',
    projectId: '',
    date: '',
    time: '09:00',
    duration: '30',
    participants: '',
    location: '',
    notes: '',
    status: 'Upcoming',
    assignedTeam: '',
    assignedMembers: []
  });

  useEffect(() => {
    if (event) {
      // Determine type
      let eventType = 'milestone';
      if (event.title.includes('👥') || event.type === 'meeting') {
        eventType = 'meeting';
      } else if (event.title.includes('📞') || event.type === 'call') {
        eventType = 'call';
      }

      // Parse description for meeting/call details
      const description = event.description || '';
      const timePart = description.match(/Time: (\d{2}:\d{2})/);
      const durationPart = description.match(/Duration: (\d+)min/);
      const participantsPart = description.match(/Participants: ([^|]+)/);
      const locationPart = description.match(/Location: ([^|]+)/);
      const notesPart = description.match(/Notes: (.+)$/);

      setFormData({
        ...event,
        title: event.title.replace('👥', '').replace('📞', '').trim(),
        type: eventType,
        time: timePart ? timePart[1] : '09:00',
        duration: durationPart ? durationPart[1] : '30',
        participants: participantsPart ? participantsPart[1].trim() : '',
        location: locationPart ? locationPart[1].trim() : '',
        notes: notesPart ? notesPart[1].trim() : '',
        assignedTeam: event.assignedTeamId || '',
        assignedMembers: event.assignedMembers || []
      });
    }
  }, [event]);

  if (!event) return null;

  const handleSave = () => {
    const updatedEvent = {
      ...formData,
      title: `${formData.type === 'meeting' ? '👥' : formData.type === 'call' ? '📞' : ''} ${formData.title}`.trim(),
      description: formData.type !== 'milestone' 
        ? `Time: ${formData.time} | Duration: ${formData.duration}min${formData.participants ? ' | Participants: ' + formData.participants : ''}${formData.location ? ' | Location: ' + formData.location : ''}${formData.notes ? ' | Notes: ' + formData.notes : ''}`
        : formData.description
    };

    updateMilestone(event.id, updatedEvent);
    toast.success('Event updated successfully!');
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMilestone(event.id);
      toast.success('Event deleted successfully!');
      onClose();
    }
  };

  const handleTeamAssignment = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    setFormData({
      ...formData,
      assignedTeam: teamId,
      assignedMembers: team ? team.members : [],
      participants: team ? team.members.map(m => m.name).join(', ') : formData.participants
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Edit {formData.type === 'meeting' ? 'Meeting' : formData.type === 'call' ? 'Call' : 'Event'}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Type Indicator */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
            {formData.type === 'meeting' && (
              <>
                <Video className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-slate-900">Meeting</span>
              </>
            )}
            {formData.type === 'call' && (
              <>
                <Phone className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-slate-900">Call</span>
              </>
            )}
            {formData.type === 'milestone' && (
              <>
                <Target className="h-5 w-5 text-teal-600" />
                <span className="font-medium text-slate-900">Milestone</span>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {(formData.type === 'meeting' || formData.type === 'call') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
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
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="assignedTeam">Assign Team (Optional)</Label>
                <select
                  id="assignedTeam"
                  value={formData.assignedTeam}
                  onChange={(e) => handleTeamAssignment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">No team assigned</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.members?.length || 0} members)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="participants">Participants</Label>
                <Input
                  id="participants"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  placeholder="e.g., John, Sarah, Mike"
                  disabled={!!formData.assignedTeam}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.assignedTeam ? 'Team assigned - auto-populated' : 'Separate names with commas'}
                </p>
              </div>

              {formData.type === 'meeting' && (
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Conference Room A, Zoom"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes / Agenda</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          {formData.type === 'milestone' && (
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
