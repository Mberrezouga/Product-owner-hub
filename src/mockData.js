// Mock data for Product Owner Dashboard
// This will be replaced with localStorage implementation later

export const mockProjects = [
  {
    id: '1',
    name: 'E-Commerce Platform Redesign',
    description: 'Complete overhaul of the customer-facing e-commerce platform',
    status: 'In Progress',
    priority: 'High',
    progress: 65,
    startDate: '2025-06-01',
    endDate: '2025-08-30',
    budget: {
      planned: 150000,
      actual: 98000,
      categories: [
        { name: 'Development', planned: 80000, actual: 52000 },
        { name: 'Design', planned: 30000, actual: 20000 },
        { name: 'Testing', planned: 20000, actual: 15000 },
        { name: 'Infrastructure', planned: 20000, actual: 11000 }
      ]
    },
    team: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
    color: '#10b981'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'iOS and Android mobile application for customer engagement',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    startDate: '2025-07-01',
    endDate: '2025-10-15',
    budget: {
      planned: 200000,
      actual: 75000,
      categories: [
        { name: 'Development', planned: 120000, actual: 45000 },
        { name: 'Design', planned: 40000, actual: 18000 },
        { name: 'Testing', planned: 25000, actual: 8000 },
        { name: 'Marketing', planned: 15000, actual: 4000 }
      ]
    },
    team: ['Eve Martinez', 'Frank Wilson', 'Grace Lee'],
    color: '#3b82f6'
  },
  {
    id: '3',
    name: 'API Integration Suite',
    description: 'Third-party API integrations for payment and shipping',
    status: 'Planning',
    priority: 'Medium',
    progress: 15,
    startDate: '2025-08-01',
    endDate: '2025-11-30',
    budget: {
      planned: 80000,
      actual: 8000,
      categories: [
        { name: 'Development', planned: 50000, actual: 5000 },
        { name: 'Testing', planned: 20000, actual: 2000 },
        { name: 'Documentation', planned: 10000, actual: 1000 }
      ]
    },
    team: ['Henry Chen', 'Iris Kim'],
    color: '#f59e0b'
  },
  {
    id: '4',
    name: 'Security Audit & Compliance',
    description: 'GDPR compliance and security vulnerability assessment',
    status: 'Completed',
    priority: 'Critical',
    progress: 100,
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    budget: {
      planned: 50000,
      actual: 48000,
      categories: [
        { name: 'Audit', planned: 25000, actual: 24000 },
        { name: 'Implementation', planned: 20000, actual: 19000 },
        { name: 'Documentation', planned: 5000, actual: 5000 }
      ]
    },
    team: ['Jack Brown', 'Karen White'],
    color: '#6366f1'
  }
];

export const mockTasks = [
  // E-Commerce Platform tasks
  { id: 't1', projectId: '1', title: 'User Research & Analysis', status: 'Completed', priority: 'High', assignee: 'Alice Johnson', deadline: '2025-06-15', description: 'Conduct user interviews and analyze current platform usage' },
  { id: 't2', projectId: '1', title: 'Design System Creation', status: 'Completed', priority: 'High', assignee: 'Carol Davis', deadline: '2025-07-01', description: 'Create comprehensive design system with components' },
  { id: 't3', projectId: '1', title: 'Frontend Development - Homepage', status: 'In Progress', priority: 'High', assignee: 'Bob Smith', deadline: '2025-07-20', description: 'Implement new homepage design' },
  { id: 't4', projectId: '1', title: 'Shopping Cart Redesign', status: 'In Progress', priority: 'High', assignee: 'Alice Johnson', deadline: '2025-07-25', description: 'Rebuild shopping cart with improved UX' },
  { id: 't5', projectId: '1', title: 'Payment Integration', status: 'In Review', priority: 'Critical', assignee: 'Bob Smith', deadline: '2025-08-05', description: 'Integrate new payment gateway' },
  { id: 't6', projectId: '1', title: 'Performance Optimization', status: 'Not Started', priority: 'Medium', assignee: 'Alice Johnson', deadline: '2025-08-15', description: 'Optimize load times and performance' },
  { id: 't7', projectId: '1', title: 'User Testing', status: 'Not Started', priority: 'High', assignee: 'Carol Davis', deadline: '2025-08-20', description: 'Conduct user acceptance testing' },
  
  // Mobile App tasks
  { id: 't8', projectId: '2', title: 'Mobile UI/UX Design', status: 'Completed', priority: 'High', assignee: 'Grace Lee', deadline: '2025-07-15', description: 'Design mobile interface mockups' },
  { id: 't9', projectId: '2', title: 'Authentication Module', status: 'In Progress', priority: 'High', assignee: 'Eve Martinez', deadline: '2025-07-30', description: 'Implement user authentication' },
  { id: 't10', projectId: '2', title: 'Product Catalog View', status: 'In Progress', priority: 'High', assignee: 'Frank Wilson', deadline: '2025-08-10', description: 'Build product browsing interface' },
  { id: 't11', projectId: '2', title: 'Push Notifications', status: 'Not Started', priority: 'Medium', assignee: 'Eve Martinez', deadline: '2025-08-25', description: 'Implement push notification system' },
  { id: 't12', projectId: '2', title: 'Offline Mode', status: 'Not Started', priority: 'Low', assignee: 'Frank Wilson', deadline: '2025-09-15', description: 'Enable offline functionality' },
  
  // API Integration tasks
  { id: 't13', projectId: '3', title: 'API Requirements Analysis', status: 'In Progress', priority: 'High', assignee: 'Henry Chen', deadline: '2025-08-15', description: 'Document all API requirements' },
  { id: 't14', projectId: '3', title: 'Stripe Integration', status: 'Not Started', priority: 'High', assignee: 'Henry Chen', deadline: '2025-09-01', description: 'Integrate Stripe payment API' },
  { id: 't15', projectId: '3', title: 'Shipping Provider APIs', status: 'Not Started', priority: 'Medium', assignee: 'Iris Kim', deadline: '2025-09-20', description: 'Integrate shipping providers' },
  
  // Security Audit tasks (completed)
  { id: 't16', projectId: '4', title: 'Security Vulnerability Scan', status: 'Completed', priority: 'Critical', assignee: 'Jack Brown', deadline: '2025-05-20', description: 'Run comprehensive security scan' },
  { id: 't17', projectId: '4', title: 'GDPR Compliance Review', status: 'Completed', priority: 'Critical', assignee: 'Karen White', deadline: '2025-06-01', description: 'Review and implement GDPR requirements' },
  { id: 't18', projectId: '4', title: 'Security Documentation', status: 'Completed', priority: 'High', assignee: 'Jack Brown', deadline: '2025-06-20', description: 'Create security documentation' }
];

export const mockSprints = [
  {
    id: 's1',
    name: 'Sprint 14 - Q3 Planning',
    startDate: '2025-07-14',
    endDate: '2025-07-27',
    status: 'Active',
    projects: ['1', '2'],
    goals: [
      'Complete homepage redesign',
      'Launch mobile authentication',
      'Begin payment integration testing'
    ]
  },
  {
    id: 's2',
    name: 'Sprint 15 - Mobile Focus',
    startDate: '2025-07-28',
    endDate: '2025-08-10',
    status: 'Planned',
    projects: ['2', '3'],
    goals: [
      'Complete product catalog mobile view',
      'Begin API integration phase',
      'Shopping cart redesign completion'
    ]
  }
];

export const mockMilestones = [
  { id: 'm1', projectId: '1', title: 'Beta Launch', date: '2025-08-15', status: 'Upcoming' },
  { id: 'm2', projectId: '1', title: 'Production Release', date: '2025-08-30', status: 'Upcoming' },
  { id: 'm3', projectId: '2', title: 'iOS App Store Submission', date: '2025-10-01', status: 'Upcoming' },
  { id: 'm4', projectId: '2', title: 'Android Play Store Launch', date: '2025-10-15', status: 'Upcoming' },
  { id: 'm5', projectId: '4', title: 'Security Certification', date: '2025-06-30', status: 'Completed' }
];

export const getProjectStats = () => {
  const total = mockProjects.length;
  const completed = mockProjects.filter(p => p.status === 'Completed').length;
  const inProgress = mockProjects.filter(p => p.status === 'In Progress').length;
  const planning = mockProjects.filter(p => p.status === 'Planning').length;
  
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget.planned, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.budget.actual, 0);
  
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'Completed').length;
  
  return {
    total,
    completed,
    inProgress,
    planning,
    totalBudget,
    totalSpent,
    budgetUtilization: Math.round((totalSpent / totalBudget) * 100),
    totalTasks,
    completedTasks,
    taskCompletionRate: Math.round((completedTasks / totalTasks) * 100)
  };
};