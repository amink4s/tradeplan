/**
 * Firestore path utilities for consistent collection access
 */

const getAppId = () => import.meta.env.VITE_APP_ID || 'trade-plan-v0';

/**
 * Get the base path for app data
 */
export const getAppBasePath = () => {
  const appId = getAppId();
  return ['artifacts', appId, 'public', 'data'];
};

/**
 * Get the path to the users collection
 */
export const getUsersCollectionPath = () => {
  return [...getAppBasePath(), 'users'];
};

/**
 * Get the path to a specific user document
 */
export const getUserDocPath = (fid) => {
  return [...getUsersCollectionPath(), fid.toString()];
};

/**
 * Get the path to the trades collection for a specific user
 * Each user has their own trades subcollection
 */
export const getTradesCollectionPath = (userId) => {
  const appId = getAppId();
  return ['artifacts', appId, 'users', userId, 'trades'];
};

/**
 * Get the path to a specific trade document for a user
 */
export const getTradeDocPath = (userId, tradeId) => {
  return [...getTradesCollectionPath(userId), tradeId];
};
