import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { doc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { Project, UserProfile } from '../types';

export async function saveProjectToFirestore(project: Project): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;

  const path = `projects/${project.id}`;
  try {
    const projectRef = doc(db, 'projects', project.id);
    await setDoc(projectRef, {
      ...project,
      userId: currentUid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving project to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadProjectsFromFirestore(): Promise<Project[]> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return [];

  const path = 'projects';
  try {
    const projectsQuery = query(collection(db, 'projects'), where('userId', '==', currentUid));
    const querySnapshot = await getDocs(projectsQuery);
    const projects: Project[] = [];
    querySnapshot.forEach((docSnap) => {
      projects.push(docSnap.data() as Project);
    });
    return projects;
  } catch (error) {
    console.error('Error loading projects from Firestore:', error);
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;

  const path = `projects/${projectId}`;
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project from Firestore:', error);
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveJobToFirestore(job: any): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;

  const path = `generationJobs/${job.jobId}`;
  try {
    const jobRef = doc(db, 'generationJobs', job.jobId);
    await setDoc(jobRef, {
      ...job,
      userId: currentUid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving job to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveAssetToFirestore(asset: any): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;

  const assetId = asset.id || `asset_${Date.now()}`;
  const path = `assets/${assetId}`;
  try {
    const assetRef = doc(db, 'assets', assetId);
    await setDoc(assetRef, {
      ...asset,
      userId: currentUid,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving asset to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveGenerationPackageToFirestore(pkg: any): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;

  const pkgId = pkg.id || `pkg_${Date.now()}`;
  const path = `generationPackages/${pkgId}`;
  try {
    const pkgRef = doc(db, 'generationPackages', pkgId);
    await setDoc(pkgRef, {
      ...pkg,
      userId: currentUid,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving generation package to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveUserToFirestore(user: UserProfile): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (!currentUid) return;

  const path = `users/${currentUid}`;
  try {
    const userRef = doc(db, 'users', currentUid);
    await setDoc(userRef, {
      userId: currentUid,
      displayName: user.name,
      email: user.email,
      photoURL: user.avatarUrl,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
