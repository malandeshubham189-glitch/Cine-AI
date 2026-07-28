import { RenderJob, RenderJobStatus, PipelineStageKey, RenderJobLog } from '../types';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';

const STORAGE_KEY_JOBS = 'cineai_render_jobs_v1';

type JobQueueListener = (jobs: RenderJob[], activeJob: RenderJob | null) => void;

class JobQueueManager {
  private jobs: RenderJob[] = [];
  private listeners: Set<JobQueueListener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_JOBS);
      if (stored) {
        this.jobs = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load render jobs from storage:', e);
      this.jobs = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(this.jobs));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save render jobs to storage:', e);
    }
  }

  public subscribe(listener: JobQueueListener): () => void {
    this.listeners.add(listener);
    listener(this.jobs, this.getActiveJob());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const active = this.getActiveJob();
    this.listeners.forEach((listener) => listener([...this.jobs], active));
  }

  public getJobs(): RenderJob[] {
    return [...this.jobs];
  }

  public getActiveJob(): RenderJob | null {
    return this.jobs.find((j) => j.status !== 'Completed' && j.status !== 'Failed' && j.status !== 'Cancelled') || null;
  }

  public createJob(projectId: string, episodeId: string, title: string): RenderJob {
    const newJob: RenderJob = {
      jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      episodeId,
      userId: auth.currentUser?.uid || 'guest-user',
      title: title || 'Full AI Movie Episode',
      currentStageKey: 'idea',
      currentStageName: 'Idea Analysis & Pre-Production',
      progressPercent: 0,
      startedTime: new Date().toISOString(),
      estimatedTimeMs: 45000,
      retryCount: 0,
      maxRetries: 3,
      priority: 'High',
      status: 'Queued',
      provider: 'Gemini 3.6 Flash + Veo + Imagen 3',
      logs: [
        {
          timestamp: new Date().toISOString(),
          stage: 'idea',
          level: 'info',
          message: 'Render job queued in CineAI CreatorOS Production Engine.',
          provider: 'JobQueueServer',
        },
      ],
    };

    // Replace any existing active job or append
    const existingActiveIndex = this.jobs.findIndex(
      (j) => j.status !== 'Completed' && j.status !== 'Failed' && j.status !== 'Cancelled'
    );
    if (existingActiveIndex >= 0) {
      this.jobs[existingActiveIndex].status = 'Cancelled';
    }

    this.jobs.unshift(newJob);
    this.saveToStorage();
    this.syncToFirestore(newJob);
    return newJob;
  }

  public updateJobProgress(
    jobId: string,
    stageKey: PipelineStageKey,
    stageName: string,
    progressPercent: number,
    logMessage?: string,
    status: RenderJobStatus = 'Preparing'
  ) {
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    job.currentStageKey = stageKey;
    job.currentStageName = stageName;
    job.progressPercent = Math.min(100, Math.max(0, progressPercent));
    job.status = status;

    if (logMessage) {
      job.logs.push({
        timestamp: new Date().toISOString(),
        stage: stageKey,
        level: progressPercent === 100 ? 'success' : 'info',
        message: logMessage,
        provider: 'Gemini3.6 / Veo Engine',
      });
    }

    if (progressPercent >= 100 && stageKey === 'exportPackage') {
      job.status = 'Completed';
      job.completedTime = new Date().toISOString();
    }

    this.saveToStorage();
    this.syncToFirestore(job);
  }

  public addLog(jobId: string, log: Omit<RenderJobLog, 'timestamp'>) {
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    job.logs.push({
      ...log,
      timestamp: new Date().toISOString(),
    });
    this.saveToStorage();
  }

  public markJobFailed(jobId: string, errorMessage: string) {
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    job.status = 'Failed';
    job.errorMessage = errorMessage;
    job.logs.push({
      timestamp: new Date().toISOString(),
      stage: job.currentStageKey,
      level: 'error',
      message: `Job Execution Failed: ${errorMessage}`,
      provider: 'EngineException',
    });

    this.saveToStorage();
    this.syncToFirestore(job);
  }

  public cancelJob(jobId: string) {
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job) return;

    job.status = 'Cancelled';
    job.logs.push({
      timestamp: new Date().toISOString(),
      stage: job.currentStageKey,
      level: 'warn',
      message: 'Render job cancelled by user.',
      provider: 'UserAction',
    });

    this.saveToStorage();
    this.syncToFirestore(job);
  }

  public retryJob(jobId: string): RenderJob | null {
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job) return null;

    job.status = 'Queued';
    job.retryCount += 1;
    job.errorMessage = undefined;
    job.progressPercent = 0;
    job.logs.push({
      timestamp: new Date().toISOString(),
      stage: 'idea',
      level: 'info',
      message: `Retrying job (Attempt ${job.retryCount}/${job.maxRetries})...`,
      provider: 'JobQueueServer',
    });

    this.saveToStorage();
    this.syncToFirestore(job);
    return job;
  }

  public clearJobHistory() {
    this.jobs = this.jobs.filter(
      (j) => j.status !== 'Completed' && j.status !== 'Failed' && j.status !== 'Cancelled'
    );
    this.saveToStorage();
  }

  private async syncToFirestore(job: RenderJob) {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    try {
      const jobRef = doc(db, 'render_jobs', job.jobId);
      await setDoc(jobRef, { ...job, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Firestore sync job notice:', e);
    }
  }
}

export const jobQueueManager = new JobQueueManager();
