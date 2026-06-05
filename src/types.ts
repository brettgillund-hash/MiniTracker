export type ProjectStatus = 'Backlog' | 'Planning' | 'Painting' | 'Completed';

export interface ProjectUpdate {
  id: string;
  type: 'note' | 'image';
  content: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  faction: string;
  status: ProjectStatus;
  notes: string;
  imageUri?: string;
  createdAt: string;
  updates: ProjectUpdate[];
}
