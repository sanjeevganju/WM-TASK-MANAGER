import { projectId, publicAnonKey } from './supabase/info';
import { supabaseClient } from './supabaseClient';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-f8ee75b1`;

interface FetchOptions extends RequestInit {
  body?: any;
}

async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  // Check if Supabase is configured
  if (!projectId || projectId === 'YOUR_PROJECT_ID' || !publicAnonKey || publicAnonKey === 'YOUR_ANON_KEY') {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

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

// ========== MANPOWER API ==========

export interface ManpowerEntry {
  id?: string;
  region?: string;
  first_name: string;
  second_name?: string;
  skill?: string;
  contact_no?: string;
  full_name?: string;
}

export const manpowerAPI = {
  // Get all manpower from Google Sheets via backend
  getAll: async (): Promise<ManpowerEntry[]> => {
    try {
      console.log('🔍 Fetching manpower from Google Sheets...');
      const data = await apiFetch('/manpower');
      console.log('✅ Loaded manpower from Google Sheets:', data.manpower?.length || 0, 'records');
      return data.manpower || [];
    } catch (err) {
      console.error('❌ Error fetching manpower:', err);
      return [];
    }
  },

  // Get manpower filtered by skill
  getBySkill: async (skill: string): Promise<ManpowerEntry[]> => {
    try {
      const data = await apiFetch(`/manpower/by-skill/${skill}`);
      return data.manpower || [];
    } catch (err) {
      console.error('❌ Error fetching manpower by skill:', err);
      return [];
    }
  },

  // Get a specific manpower entry
  get: async (id: string): Promise<ManpowerEntry | null> => {
    try {
      const data = await apiFetch(`/manpower/${id}`);
      return data.manpower;
    } catch (err) {
      console.error('❌ Error fetching manpower entry:', err);
      return null;
    }
  },
};
