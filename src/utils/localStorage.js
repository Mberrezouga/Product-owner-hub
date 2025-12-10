// localStorage utility functions for data persistence

const STORAGE_KEYS = {
  PROJECTS: 'po_hub_projects',
  TASKS: 'po_hub_tasks',
  SPRINTS: 'po_hub_sprints',
  MILESTONES: 'po_hub_milestones',
  USER: 'po_hub_user',
  NOTIFICATIONS: 'po_hub_notifications'
};

// Get data from localStorage
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

// Save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Remove data from localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

// Clear all app data
export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
};

// Initialize with mock data if empty
export const initializeStorage = (mockData) => {
  if (!getFromStorage(STORAGE_KEYS.PROJECTS)) {
    saveToStorage(STORAGE_KEYS.PROJECTS, mockData.projects);
  }
  if (!getFromStorage(STORAGE_KEYS.TASKS)) {
    saveToStorage(STORAGE_KEYS.TASKS, mockData.tasks);
  }
  if (!getFromStorage(STORAGE_KEYS.SPRINTS)) {
    saveToStorage(STORAGE_KEYS.SPRINTS, mockData.sprints);
  }
  if (!getFromStorage(STORAGE_KEYS.MILESTONES)) {
    saveToStorage(STORAGE_KEYS.MILESTONES, mockData.milestones);
  }
  if (!getFromStorage(STORAGE_KEYS.NOTIFICATIONS)) {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, []);
  }
};

export default STORAGE_KEYS;
