import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Episode, 
  Character, 
  CinematicPrompt, 
  UserProfile, 
  NavigationTab,
  CreditTransaction,
  AIModelConfig
} from './types';
import { 
  loadProjects, 
  saveProjects, 
  loadCharacters, 
  saveCharacters, 
  loadPrompts, 
  savePrompts, 
  loadUser, 
  saveUser, 
  loadTransactions, 
  saveTransactions, 
  loadModelConfig, 
  saveModelConfig 
} from './lib/storage';

import { AuroraBackground } from './components/ui/AuroraBackground';
import { AppHeader } from './components/layout/AppHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppFooter } from './components/layout/AppFooter';
import { NotificationsModal } from './components/layout/NotificationsModal';
import { QuickSearchModal } from './components/layout/QuickSearchModal';
import { KeyboardShortcutsModal } from './components/layout/KeyboardShortcutsModal';
import { AuthModal } from './components/layout/AuthModal';
import { FloatingJobConsole } from './components/layout/FloatingJobConsole';
import { ToastContainer, ToastMessage } from './components/ui/ToastContainer';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { DashboardView } from './components/features/dashboard/DashboardView';
import { ProjectsView } from './components/features/projects/ProjectsView';
import { CharacterLibraryView } from './components/features/characters/CharacterLibraryView';
import { PromptLibraryView } from './components/features/prompts/PromptLibraryView';
import { ExportEngineView } from './components/features/export/ExportEngineView';
import { UserSettingsView } from './components/features/settings/UserSettingsView';
import { EpisodeGeneratorWizard } from './components/features/ai-studio/EpisodeGeneratorWizard';

export default function App() {
  // Local state initialized with storage
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [activeProject, setActiveProject] = useState<Project>(projects[0] || loadProjects()[0]);
  const [activeEpisode, setActiveEpisode] = useState<Episode>(
    activeProject?.episodes?.[0] || loadProjects()[0]?.episodes?.[0]
  );

  const [characters, setCharacters] = useState<Character[]>(loadCharacters);
  const [prompts, setPrompts] = useState<CinematicPrompt[]>(loadPrompts);
  const [user, setUser] = useState<UserProfile>(loadUser);
  const [transactions, setTransactions] = useState<CreditTransaction[]>(loadTransactions);
  const [modelConfig, setModelConfig] = useState<AIModelConfig>(loadModelConfig);

  // App Shell State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isEpisodeWizardOpen, setIsEpisodeWizardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(prev => ({
          ...prev,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || prev.name,
          email: fbUser.email || prev.email,
          avatarUrl: fbUser.photoURL || prev.avatarUrl,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K -> Floating AI Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // Cmd/Ctrl + N -> New Episode Generator Wizard
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsEpisodeWizardOpen(true);
      }
      // '?' -> Keyboard Shortcuts modal
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active Prompt in Generator State
  const [prefilledPrompt, setPrefilledPrompt] = useState<string | null>(null);

  // Real-time Toast System State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts(prev => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persist state updates
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  useEffect(() => {
    savePrompts(prompts);
  }, [prompts]);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveModelConfig(modelConfig);
  }, [modelConfig]);

  // Handler when a new movie/project is automatically created from generation
  const handleAutoCreateProject = (newProj: Project) => {
    setProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    if (newProj.episodes?.[0]) {
      setActiveEpisode(newProj.episodes[0]);
    }
    addToast("Project Created", `"${newProj.title}" added to Studio Workspace`, 'success');
  };

  // Handler to duplicate a project
  const handleDuplicateProject = (proj: Project) => {
    const dupProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      title: `${proj.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [dupProj, ...prev]);
    addToast("Project Duplicated", `Created copy of "${proj.title}"`, 'info');
  };

  // Handler to delete a project
  const handleDeleteProject = (projectId: string) => {
    const projToDelete = projects.find(p => p.id === projectId);
    if (!projToDelete) return;

    if (window.confirm(`Are you sure you want to delete project "${projToDelete.title}"?`)) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (activeProject?.id === projectId) {
        const remaining = projects.filter(p => p.id !== projectId);
        if (remaining.length > 0) {
          setActiveProject(remaining[0]);
        }
      }
      addToast("Project Deleted", `Removed "${projToDelete.title}"`, 'warning');
    }
  };

  // Handler when prompt template selected
  const handleUsePromptInEditor = (promptText: string) => {
    setPrefilledPrompt(promptText);
    setActiveTab('dashboard');
    addToast("Prompt Loaded", "Prompt template filled into generator", 'info');
  };

  // Handler when user logs out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      addToast("Session Logged Out", "Logged out safely. Click profile to resume session.", 'info');
    } catch (e) {
      addToast("Logout", "Logged out from session", 'info');
    }
  };

  // Handler when a new episode is created via AI wizard
  const handleEpisodeCreated = (newEp: Episode) => {
    const updatedEpisodes = [...activeProject.episodes, newEp];
    const updatedProj = { ...activeProject, episodes: updatedEpisodes };
    setActiveProject(updatedProj);
    setActiveEpisode(newEp);
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));

    // Deduct AI credits
    const creditCost = newEp.estimatedCredits || 1200;
    setUser(prev => ({
      ...prev,
      creditsRemaining: Math.max(0, prev.creditsRemaining - creditCost),
      totalCreditsUsed: prev.totalCreditsUsed + creditCost
    }));

    // Add log transaction
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      feature: 'AI Script Generation',
      creditsUsed: creditCost,
      status: 'Completed'
    };
    setTransactions(prev => [newTx, ...prev]);

    addToast("Episode Created", `S${newEp.seasonNumber}E${newEp.episodeNumber} generated successfully`, 'success');
    setActiveTab('dashboard');
  };

  // Handler to add a new character
  const handleSaveCharacter = (newChar: Character) => {
    setCharacters(prev => [newChar, ...prev]);
    const updatedChars = [...(activeProject.characters || []), newChar];
    const updatedProj = { ...activeProject, characters: updatedChars };
    setActiveProject(updatedProj);
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
    addToast("Character Saved", `Added "${newChar.name}" to Master Character Engine`, 'success');
  };

  // Handler to add a new prompt
  const handleSavePrompt = (newPrompt: CinematicPrompt) => {
    setPrompts(prev => [newPrompt, ...prev]);
    addToast("Prompt Saved", `Saved "${newPrompt.title}" to Prompt Library`, 'success');
  };

  return (
    <div className="relative min-h-screen bg-[#050816] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background Aurora Canvas */}
      <AuroraBackground />

      <div className="relative z-10 flex flex-1 w-full min-h-screen flex-col">
        <div className="flex flex-1 w-full min-h-screen">
          {/* App Sidebar */}
          <AppSidebar
            activeTab={activeTab}
            onNavigate={(tab) => {
              if (tab === 'episode-generator') {
                setIsEpisodeWizardOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onNewEpisodeClick={() => setIsEpisodeWizardOpen(true)}
          />

          {/* Main Workspace Layout */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header */}
            <AppHeader
              projects={projects}
              activeProject={activeProject}
              onSelectProject={(p) => {
                setActiveProject(p);
                if (p.episodes && p.episodes.length > 0) {
                  setActiveEpisode(p.episodes[0]);
                }
              }}
              user={user}
              activeTab={activeTab}
              onNavigate={setActiveTab}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onOpenCreditModal={() => setActiveTab('credits-billing')}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {activeTab === 'dashboard' && (
                <DashboardView
                  project={activeProject}
                  onNavigate={setActiveTab}
                  onNotify={addToast}
                  prefilledPrompt={prefilledPrompt}
                  onClearPrefilledPrompt={() => setPrefilledPrompt(null)}
                  onProjectGenerated={(newProj) => handleAutoCreateProject(newProj)}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  activeProject={activeProject}
                  onSelectProject={setActiveProject}
                  onSelectEpisode={setActiveEpisode}
                  onNavigateToStudio={() => setActiveTab('dashboard')}
                  onDuplicateProject={handleDuplicateProject}
                  onDeleteProject={handleDeleteProject}
                />
              )}

              {activeTab === 'characters' && (
                <CharacterLibraryView
                  characters={characters}
                  onSaveCharacter={handleSaveCharacter}
                />
              )}

              {activeTab === 'templates' && (
                <PromptLibraryView
                  prompts={prompts}
                  onSavePrompt={handleSavePrompt}
                  onUsePromptInEditor={handleUsePromptInEditor}
                />
              )}

              {activeTab === 'exports' && (
                <ExportEngineView
                  activeEpisode={activeEpisode}
                  project={activeProject}
                  onNotify={addToast}
                />
              )}

              {activeTab === 'settings' && (
                <UserSettingsView
                  user={user}
                  config={modelConfig}
                  onSaveUser={setUser}
                  onSaveConfig={setModelConfig}
                  onNotify={addToast}
                />
              )}
            </main>

            {/* Footer */}
            <AppFooter />
          </div>
        </div>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Modals & Dialogs */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        characters={characters}
        prompts={prompts}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
        onSelectProject={(p) => setActiveProject(p)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <EpisodeGeneratorWizard
        isOpen={isEpisodeWizardOpen}
        onClose={() => setIsEpisodeWizardOpen(false)}
        project={activeProject}
        onEpisodeCreated={handleEpisodeCreated}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(authUser) => {
          setUser(prev => ({
            ...prev,
            name: authUser.name,
            email: authUser.email,
            avatarUrl: authUser.avatarUrl,
          }));
          addToast("Authenticated Successfully", `Welcome to CineAI CreatorOS, ${authUser.name}`, 'success');
        }}
      />

      <FloatingJobConsole />
    </div>
  );
}
