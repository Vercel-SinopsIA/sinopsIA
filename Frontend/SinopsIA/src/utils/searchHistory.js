const MAX_HISTORY_ENTRIES = 30;

const getStorageKey = (userId) => `sinopsia:search-history:${userId}`;

export const getSearchHistory = (userId) => {
  const storedHistory = window.localStorage.getItem(getStorageKey(userId));
  if (!storedHistory) {
    return [];
  }

  const history = JSON.parse(storedHistory);
  if (!Array.isArray(history)) {
    throw new Error("El historial guardado tiene un formato no válido.");
  }

  return history;
};

export const addSearchToHistory = (userId, search) => {
  const history = getSearchHistory(userId);
  const entry = {
    ...search,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify([entry, ...history].slice(0, MAX_HISTORY_ENTRIES)),
  );
};

export const clearSearchHistory = (userId) => {
  window.localStorage.removeItem(getStorageKey(userId));
};
