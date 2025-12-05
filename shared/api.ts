/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Task API types
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  tag: "Work" | "Study" | "Personal";
  date: string;
  time: string;
  completed: boolean;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  tag: "Work" | "Study" | "Personal";
  date: string;
  time: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  tag?: "Work" | "Study" | "Personal";
  date?: string;
  time?: string;
  completed?: boolean;
}

/**
 * API Base URL - adjust based on your backend URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5107";

/**
 * Task API client
 */
export const taskApi = {
  /**
   * Get all tasks with optional filters
   */
  async getTasks(category?: string, search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    
    const url = `${API_BASE_URL}/api/tasks${params.toString() ? `?${params.toString()}` : ""}`;
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          url,
          error: errorText,
        });
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("Network error - Backend may not be running:", error);
        throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw error;
    }
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Create a new task
   */
  async createTask(task: CreateTaskDto): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Update a task
   */
  async updateTask(id: string, task: UpdateTaskDto): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Toggle task completion status
   */
  async toggleTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/toggle`, {
      method: "PATCH",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to toggle task: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }
  },
};
