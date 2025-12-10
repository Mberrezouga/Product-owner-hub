import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, initializeStorage } from '../utils/localStorage';
import { mockProjects, mockTasks, mockSprints, mockMilestones } from '../mockData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Initialize with mock data if empty
    initializeStorage({
      projects: mockProjects,
      tasks: mockTasks,
      sprints: mockSprints,
      milestones: mockMilestones
    });

    // Load data from localStorage
    setProjects(getFromStorage('po_hub_projects') || []);
    setTasks(getFromStorage('po_hub_tasks') || []);
    setSprints(getFromStorage('po_hub_sprints') || []);
    setMilestones(getFromStorage('po_hub_milestones') || []);
    setNotifications(getFromStorage('po_hub_notifications') || []);
    setTeams(getFromStorage('po_hub_teams') || []);

    // Check for notifications
    checkNotifications();
  }, []);

  const checkNotifications = () => {
    const now = new Date();
    const newNotifications = [];

    // Check deadlines
    const storedTasks = getFromStorage('po_hub_tasks') || [];
    storedTasks.forEach(task => {
      if (task.status !== 'Completed') {
        const deadline = new Date(task.deadline);
        const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 3 && daysUntil >= 0) {
          newNotifications.push({
            id: `task-${task.id}`,
            type: 'deadline',
            title: 'Upcoming Deadline',
            message: `Task "${task.title}" is due in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`,
            date: new Date().toISOString(),
            read: false
          });
        }
      }
    });

    // Check budget limits
    const storedProjects = getFromStorage('po_hub_projects') || [];
    storedProjects.forEach(project => {
      const utilization = (project.budget.actual / project.budget.planned) * 100;
      if (utilization > 85) {
        newNotifications.push({
          id: `budget-${project.id}`,
          type: 'budget',
          title: 'Budget Alert',
          message: `Project "${project.name}" has used ${Math.round(utilization)}% of budget`,
          date: new Date().toISOString(),
          read: false
        });
      }
    });

    // Check milestones
    const storedMilestones = getFromStorage('po_hub_milestones') || [];
    storedMilestones.forEach(milestone => {
      if (milestone.status !== 'Completed') {
        const milestoneDate = new Date(milestone.date);
        const daysUntil = Math.ceil((milestoneDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 7 && daysUntil >= 0) {
          newNotifications.push({
            id: `milestone-${milestone.id}`,
            type: 'event',
            title: 'Upcoming Milestone',
            message: `"${milestone.title}" is ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} away`,
            date: new Date().toISOString(),
            read: false
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(newNotifications);
      saveToStorage('po_hub_notifications', newNotifications);
    }
  };

  const addProject = (project) => {
    const newProject = { ...project, id: Date.now().toString() };
    const updated = [...projects, newProject];
    setProjects(updated);
    saveToStorage('po_hub_projects', updated);
    return newProject;
  };

  const updateProject = (id, updates) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...updates } : p);
    setProjects(updated);
    saveToStorage('po_hub_projects', updated);
  };

  const deleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveToStorage('po_hub_projects', updated);
  };

  const addTask = (task) => {
    const newTask = { ...task, id: `t${Date.now()}` };
    const updated = [...tasks, newTask];
    setTasks(updated);
    saveToStorage('po_hub_tasks', updated);
    return newTask;
  };

  const updateTask = (id, updates) => {
    const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    setTasks(updated);
    saveToStorage('po_hub_tasks', updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveToStorage('po_hub_tasks', updated);
  };

  const addMilestone = (milestone) => {
    const newMilestone = { ...milestone, id: `m${Date.now()}` };
    const updated = [...milestones, newMilestone];
    setMilestones(updated);
    saveToStorage('po_hub_milestones', updated);
    return newMilestone;
  };

  const updateMilestone = (id, updates) => {
    const updated = milestones.map(m => m.id === id ? { ...m, ...updates } : m);
    setMilestones(updated);
    saveToStorage('po_hub_milestones', updated);
  };

  const deleteMilestone = (id) => {
    const updated = milestones.filter(m => m.id !== id);
    setMilestones(updated);
    saveToStorage('po_hub_milestones', updated);
  };

  const markNotificationRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveToStorage('po_hub_notifications', updated);
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveToStorage('po_hub_notifications', []);
  };

  const addTeam = (team) => {
    const newTeam = { ...team, id: Date.now().toString() };
    const updated = [...teams, newTeam];
    setTeams(updated);
    saveToStorage('po_hub_teams', updated);
    return newTeam;
  };

  const updateTeam = (id, updates) => {
    const updated = teams.map(t => t.id === id ? { ...t, ...updates } : t);
    setTeams(updated);
    saveToStorage('po_hub_teams', updated);
  };

  const deleteTeam = (id) => {
    const updated = teams.filter(t => t.id !== id);
    setTeams(updated);
    saveToStorage('po_hub_teams', updated);
  };

  const value = {
    projects,
    tasks,
    sprints,
    milestones,
    notifications,
    teams,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    markNotificationRead,
    clearNotifications,
    checkNotifications,
    addTeam,
    updateTeam,
    deleteTeam
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
