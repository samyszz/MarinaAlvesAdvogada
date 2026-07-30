import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment.prod';

const app = getApps().length ? getApp() : initializeApp(environment.firebase);

export const firestore = getFirestore(app);
export const storage = getStorage(app);