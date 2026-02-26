import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-f8ee75b1`;

interface FetchOptions extends RequestInit {
  body?: any;
}

async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error(`API Error on ${endpoint}:`, error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ========== TREK API ==========

export const trekAPI = {
  // Get all treks
  getAll: async () => {
    const data = await apiFetch('/treks');
    return data.treks || [];
  },

  // Get a specific trek
  get: async (id: string) => {
    const data = await apiFetch(`/treks/${id}`);
    return data.trek;
  },

  // Create a new trek
  create: async (trek: {
    name: string;
    startDate: string;
    endDate: string;
    numberOfClients: number;
    baseName: string;
  }) => {
    const data = await apiFetch('/treks', {
      method: 'POST',
      body: trek,
    });
    return data.trek;
  },

  // Update a trek
  update: async (id: string, updates: Partial<{
    name: string;
    startDate: string;
    endDate: string;
    numberOfClients: number;
    baseName: string;
  }>) => {
    const data = await apiFetch(`/treks/${id}`, {
      method: 'PUT',
      body: updates,
    });
    return data.trek;
  },

  // Delete a trek
  delete: async (id: string) => {
    await apiFetch(`/treks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========== TASK API ==========

export const taskAPI = {
  // Get all tasks for a trek
  getAll: async (trekId: string) => {
    const data = await apiFetch(`/treks/${trekId}/tasks`);
    return data.tasks || [];
  },

  // Update a single task
  update: async (trekId: string, taskTemplateId: string, updates: any) => {
    const data = await apiFetch(`/treks/${trekId}/tasks/${taskTemplateId}`, {
      method: 'PUT',
      body: updates,
    });
    return data.task;
  },

  // Bulk update tasks
  bulkUpdate: async (trekId: string, tasks: any[]) => {
    const data = await apiFetch(`/treks/${trekId}/tasks/bulk`, {
      method: 'POST',
      body: { tasks },
    });
    return data;
  },
};

// ========== STAFF API ==========

export const staffAPI = {
  // Get staff database
  get: async () => {
    const data = await apiFetch('/staff');
    return data.staff;
  },

  // Update staff database
  update: async (staff: {
    tripLeaders: string[];
    cooks: string[];
    assistantGuides: string[];
    supportStaff: string[];
  }) => {
    const data = await apiFetch('/staff', {
      method: 'PUT',
      body: staff,
    });
    return data.staff;
  },
};
