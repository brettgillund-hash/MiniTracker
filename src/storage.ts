import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from './types';

const STORAGE_KEY = '@minitracker:projects';

export async function loadProjects(): Promise<Project[]> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn('Failed to load projects', error);
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.warn('Failed to save projects', error);
  }
}
