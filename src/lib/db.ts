import Dexie, { type Table } from 'dexie';

export interface SessionState {
  studentId: string;
  currentNodeId: string;
  language: string;
  synced: number; // 0 for false, 1 for true
}

export interface ChatLog {
  id?: number;
  studentId: string;
  textEn: string;
  textHi: string;
  timestamp: number;
}

export interface OutboxAction {
  id?: number;
  studentId: string;
  action: string;
  payload: any;
  timestamp: number;
}

class SahAIForShikshaDatabase extends Dexie {
  sessionState!: Table<SessionState, string>;
  chatLogs!: Table<ChatLog, number>;
  outbox!: Table<OutboxAction, number>;

  constructor() {
    super('SahAIForShiksha');
    this.version(1).stores({
      sessionState: 'studentId, currentNodeId, language, synced',
      chatLogs: '++id, studentId, textEn, textHi, timestamp',
      outbox: '++id, action, payload, timestamp, studentId'
    });
  }
}

export const db = new SahAIForShikshaDatabase();

// Non-blocking helper wrappers

export async function saveSessionState(studentId: string, stateData: Omit<SessionState, 'studentId'>) {
  return db.sessionState.put({
    studentId,
    ...stateData
  });
}

export async function getSessionState(studentId: string) {
  return db.sessionState.get(studentId);
}

export async function addChatLog(studentId: string, textEn: string, textHi: string, timestamp: number = Date.now()) {
  return db.chatLogs.add({
    studentId,
    textEn,
    textHi,
    timestamp
  });
}

export async function getChatLogs(studentId: string) {
  return db.chatLogs.where('studentId').equals(studentId).toArray();
}

export async function queueOutboxAction(studentId: string, action: string, payload: any) {
  return db.outbox.add({
    studentId,
    action,
    payload,
    timestamp: Date.now()
  });
}

export async function getPendingOutboxActions() {
  return db.outbox.orderBy('id').toArray();
}

export async function removeOutboxAction(id: number) {
  return db.outbox.delete(id);
}
