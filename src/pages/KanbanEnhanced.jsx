import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  AlertCircle, 
  Calendar, 
  Plus,
  GripVertical
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddTaskModal from '../components/modals/AddTaskModal';
import TaskDetailModal from '../components/modals/TaskDetailModal';
import { toast } from 'sonner';

const SortableTask = ({ task, project, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-500',
      'High': 'bg-amber-500',
      'Medium': 'bg-blue-500',
      'Low': 'bg-slate-400'
    };
    return colors[priority] || colors['Medium'];
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && deadline;
  };

  const overdue = task.status !== 'Completed' && isOverdue(task.deadline);

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 bg-white mb-2"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing mt-1"
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
          <div className={`w-1.5 h-full absolute left-0 top-0 bottom-0 rounded-l-lg ${getPriorityColor(task.priority)}`} />
          <div className="flex-1 pl-2">
            <h4 className="font-semibold text-sm text-slate-900 mb-1">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                {task.description}
              </p>
            )}
            <div className="mb-2">
              <span 
                className="inline-block text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: project?.color + '20',
                  color: project?.color
                }}
              >
                {project?.name}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-slate-600">
                <Calendar className="h-3 w-3" />
                <span className={overdue ? 'text-red-600 font-medium' : ''}>
                  {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                {overdue && <AlertCircle className="h-3 w-3 text-red-600 ml-1" />}
              </div>
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-xs font-semibold text-white"
                    title={task.assignee}
                  >
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  return (
    <div 
      ref={setNodeRef}
      className={`bg-slate-50 border border-t-0 border-slate-200 rounded-b-lg p-2 min-h-[500px] overflow-y-auto transition-colors ${
        isOver ? 'bg-teal-50 border-teal-300' : ''
      }`}
    >
      {children}
    </div>
  );
};

const KanbanEnhanced = () => {
  const { projects, tasks, updateTask } = useData();
  const [selectedProject, setSelectedProject] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: 'Not Started', title: 'Not Started', color: 'border-slate-300' },
    { id: 'In Progress', title: 'In Progress', color: 'border-teal-300' },
    { id: 'In Review', title: 'In Review', color: 'border-blue-300' },
    { id: 'Completed', title: 'Completed', color: 'border-emerald-300' }
  ];

  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.projectId === selectedProject);

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped over a column directly
    const overColumn = columns.find(col => col.id === over.id);
    
    // Or check if dropped over another task
    const overTask = tasks.find(t => t.id === over.id);
    const overTaskColumn = overTask ? columns.find(col => col.id === overTask.status) : null;

    const targetColumn = overColumn || overTaskColumn;

    if (targetColumn && activeTask.status !== targetColumn.id) {
      updateTask(activeTask.id, { status: targetColumn.id });
      toast.success(`Task moved to ${targetColumn.title}!`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kanban Board</h1>
          <p className="text-slate-600 mt-1">Drag and drop tasks between columns</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <Button 
            onClick={() => setShowAddTask(true)}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="flex flex-col">
                <div className={`bg-white border-t-4 ${column.color} rounded-t-lg p-4 shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{column.title}</h3>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>

                <DroppableColumn id={column.id}>
                  <SortableContext 
                    items={columnTasks.map(t => t.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map(task => {
                      const project = projects.find(p => p.id === task.projectId);
                      return (
                        <SortableTask
                          key={task.id}
                          task={task}
                          project={project}
                          onClick={() => setSelectedTask(task)}
                        />
                      );
                    })}
                  </SortableContext>
                  
                  {columnTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                      No tasks
                    </div>
                  )}
                </DroppableColumn>
              </div>
            );
          })}
        </div>
      </DndContext>

      <AddTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} />
      <TaskDetailModal 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  );
};

export default KanbanEnhanced;