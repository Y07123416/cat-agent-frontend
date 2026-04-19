export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  neutered: boolean;
  allergies: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DailyRecord = {
  id: number;
  pet_id: number;
  record_date: string;
  food_amount_g: number | null;
  water_ml: number | null;
  activity_minutes: number | null;
  appetite_score: number;
  energy_score: number;
  poop_status: string | null;
  mood: string | null;
  notes: string | null;
  created_at: string;
};

export type Task = {
  id: number;
  pet_id: number;
  title: string;
  description: string | null;
  task_type: string;
  reward_xp: number;
  reward_coins: number;
  due_at: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
};

export type VirtualPetState = {
  id: number;
  pet_id: number;
  nickname: string | null;
  species_style: string;
  level: number;
  xp: number;
  coins: number;
  hunger: number;
  mood: number;
  energy: number;
  intimacy: number;
  health: number;
  growth_stage: string;
  last_fed_at: string | null;
  updated_at: string;
};

export type Dashboard = {
  pet: Pet;
  today_record: DailyRecord | null;
  tasks: Task[];
  virtual_pet_state: VirtualPetState | null;
};

export type AgentChatResponse = { reply: string };
export type DailyRecordUpsertResponse = { message: string; record: DailyRecord };
export type TaskCompleteResponse = { message: string; task: Task; virtual_pet_state: VirtualPetState };

export async function listPets(): Promise<Pet[]> {
  return request<Pet[]>("/api/pets");
}

export async function createPet(payload: {
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  birth_date?: string;
  weight_kg?: number;
  neutered?: boolean;
  allergies?: string;
}): Promise<Pet> {
  return request<Pet>("/api/pets", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function createVirtualPet(payload: {
  pet_id: number;
  nickname?: string;
  species_style?: string;
}): Promise<VirtualPetState> {
  return request<VirtualPetState>("/api/virtual-pet-states", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getDashboard(petId: number): Promise<Dashboard> {
  return request<Dashboard>(`/api/pets/${petId}/dashboard`);
}

export async function upsertDailyRecord(payload: {
  pet_id: number;
  record_date: string;
  food_amount_g?: number | null;
  water_ml?: number | null;
  activity_minutes?: number | null;
  appetite_score?: number;
  energy_score?: number;
  poop_status?: string | null;
  mood?: string | null;
  notes?: string | null;
}): Promise<DailyRecordUpsertResponse> {
  return request<DailyRecordUpsertResponse>("/api/daily-records", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function listTasksByPet(petId: number): Promise<Task[]> {
  return request<Task[]>(`/api/tasks/pet/${petId}`);
}

export async function createTask(payload: {
  pet_id: number;
  title: string;
  description?: string;
  task_type: string;
  reward_xp?: number;
  reward_coins?: number;
  due_at?: string | null;
}): Promise<Task> {
  return request<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function completeTask(taskId: number): Promise<TaskCompleteResponse> {
  return request<TaskCompleteResponse>(`/api/tasks/${taskId}/complete`, { method: "POST" });
}

export async function chatWithAgent(payload: { pet_id: number; message: string }): Promise<AgentChatResponse> {
  return request<AgentChatResponse>("/api/agent/chat", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
