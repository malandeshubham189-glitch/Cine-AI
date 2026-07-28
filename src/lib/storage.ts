import { Project, Character, CinematicPrompt, UserProfile, CreditTransaction, AIModelConfig } from '../types';
import { DEFAULT_PROJECTS, DEFAULT_CHARACTERS, DEFAULT_PROMPTS, INITIAL_USER, INITIAL_TRANSACTIONS, INITIAL_MODEL_CONFIG } from '../data/defaultData';
import { saveProjectToFirestore, saveUserToFirestore } from './firestoreStorage';

const STORAGE_KEYS = {
  PROJECTS: 'cineai_projects_v1',
  CHARACTERS: 'cineai_characters_v1',
  PROMPTS: 'cineai_prompts_v1',
  USER: 'cineai_user_v1',
  TRANSACTIONS: 'cineai_transactions_v1',
  CONFIG: 'cineai_config_v1',
};

export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : DEFAULT_PROJECTS;
  } catch (e) {
    console.error('Failed to load projects from storage:', e);
    return DEFAULT_PROJECTS;
  }
};

export const saveProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    // Asynchronously sync projects to Firestore
    projects.forEach(p => {
      saveProjectToFirestore(p).catch(err => console.warn('Firestore sync background notice:', err));
    });
  } catch (e) {
    console.error('Failed to save projects to storage:', e);
  }
};

export const loadCharacters = (): Character[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    return data ? JSON.parse(data) : DEFAULT_CHARACTERS;
  } catch (e) {
    return DEFAULT_CHARACTERS;
  }
};

export const saveCharacters = (characters: Character[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
  } catch (e) {
    console.error('Failed to save characters:', e);
  }
};

export const loadPrompts = (): CinematicPrompt[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    return data ? JSON.parse(data) : DEFAULT_PROMPTS;
  } catch (e) {
    return DEFAULT_PROMPTS;
  }
};

export const savePrompts = (prompts: CinematicPrompt[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (e) {
    console.error('Failed to save prompts:', e);
  }
};

export const loadUser = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : INITIAL_USER;
  } catch (e) {
    return INITIAL_USER;
  }
};

export const saveUser = (user: UserProfile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    saveUserToFirestore(user).catch(err => console.warn('User profile sync notice:', err));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
};

export const loadTransactions = (): CreditTransaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch (e) {
    return INITIAL_TRANSACTIONS;
  }
};

export const saveTransactions = (transactions: CreditTransaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
};

export const loadModelConfig = (): AIModelConfig => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? JSON.parse(data) : INITIAL_MODEL_CONFIG;
  } catch (e) {
    return INITIAL_MODEL_CONFIG;
  }
};

export const saveModelConfig = (config: AIModelConfig) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
};
