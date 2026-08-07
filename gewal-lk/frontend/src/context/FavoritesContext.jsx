import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth.js";
import {
  addFavorite,
  getFavoriteIds,
  removeFavorite,
} from "../services/favoriteService.js";

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [savedIds, setSavedIds] = useState(new Set());

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedIds(new Set());
      return;
    }

    try {
      const result = await getFavoriteIds();
      setSavedIds(new Set(result.data.propertyIds));
    } catch {
      setSavedIds(new Set());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (propertyId) => {
    const wasSaved = savedIds.has(propertyId);

    setSavedIds((current) => {
      const next = new Set(current);
      if (wasSaved) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });

    try {
      if (wasSaved) {
        await removeFavorite(propertyId);
      } else {
        await addFavorite(propertyId);
      }
    } catch (error) {
      /*
       * Resync with the server on failure — e.g. a stale session —
       * rather than leaving the optimistic update in a wrong state.
       */
      refresh();
      throw error;
    }
  };

  const contextValue = useMemo(
    () => ({
      savedIds,
      isSaved: (propertyId) => savedIds.has(propertyId),
      toggle,
      refresh,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedIds, refresh]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}
