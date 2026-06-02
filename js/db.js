// js/db.js
// SahAI for Shiksha - Offline IndexedDB and Sync Engine
// Enforces clean asynchronous non-blocking Promise wrappers for database read/write actions.

// Instantiate Dexie Database
const db = new Dexie('SahAIForShiksha');

// Declare Schema for Version 1
db.version(1).stores({
  sessionState: 'studentId, currentNodeId, language, synced',
  chatLogs: '++id, studentId, textEn, textHi, timestamp',
  outbox: '++id, action, payload, timestamp, studentId'
});

// Non-blocking Promise Wrappers for DB Read/Write Actions

/**
 * Saves or updates session state for a student.
 * @param {string} studentId 
 * @param {object} stateData { currentNodeId, language, synced }
 * @returns {Promise<string>} studentId
 */
function saveSessionState(studentId, stateData) {
  return db.sessionState.put({
    studentId,
    ...stateData
  });
}

/**
 * Retrieves session state for a student.
 * @param {string} studentId 
 * @returns {Promise<object|undefined>}
 */
function getSessionState(studentId) {
  return db.sessionState.get(studentId);
}

/**
 * Appends a chat log message to local chatLogs store.
 * @param {string} studentId 
 * @param {string} textEn 
 * @param {string} textHi 
 * @param {number} timestamp 
 * @returns {Promise<number>} generated id
 */
function addChatLog(studentId, textEn, textHi, timestamp = Date.now()) {
  return db.chatLogs.add({
    studentId,
    textEn,
    textHi,
    timestamp
  });
}

/**
 * Retrieves all chat logs for a specific student.
 * @param {string} studentId 
 * @returns {Promise<Array>}
 */
function getChatLogs(studentId) {
  return db.chatLogs.where('studentId').equals(studentId).toArray();
}

/**
 * Adds an action item to the offline synchronization outbox.
 * @param {string} studentId 
 * @param {string} action 
 * @param {object} payload 
 * @returns {Promise<number>} generated id
 */
function queueOutboxAction(studentId, action, payload) {
  return db.outbox.add({
    studentId,
    action,
    payload,
    timestamp: Date.now()
  });
}

/**
 * Retrieves all pending sync actions in FIFO order.
 * @returns {Promise<Array>}
 */
function getPendingOutboxActions() {
  return db.outbox.orderBy('id').toArray();
}

/**
 * Removes an action from the outbox after successful sync.
 * @param {number} id 
 * @returns {Promise<void>}
 */
function removeOutboxAction(id) {
  return db.outbox.delete(id);
}
