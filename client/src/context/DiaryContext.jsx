import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  fetchAllDiaryEntries, // new!
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} from "../apis";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

// Utility: Local cache key
const DIARY_CACHE_LS_KEY = "diaryEntries";

export const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const { user, getToken } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // ------- LOAD ALL ENTRIES ---------
  const loadEntries = useCallback(async () => {
    if (!user) return setEntries([]);
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await fetchAllDiaryEntries(token);
      setEntries(data);
      localStorage.setItem(DIARY_CACHE_LS_KEY, JSON.stringify(data));
    } catch (err) {
      toast.error("Failed to fetch diary entries.");
      // If local copy exists, use it:
      const cached = localStorage.getItem(DIARY_CACHE_LS_KEY);
      if (cached) setEntries(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  // ------- INITIALIZE: load from cache, then background-refresh from server -------
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }
    // On first login load, rehydrate from localStorage:
    const cached = localStorage.getItem(DIARY_CACHE_LS_KEY);
    if (cached) setEntries(JSON.parse(cached));
    // Always refresh in the background:
    loadEntries();
  }, [user, loadEntries]);

  // ------- GET entry for a date -------
  const getEntryByDateStr = useCallback(
    (dateStr) => entries.find((e) => e.dateStr === dateStr),
    [entries]
  );

  // ------- CREATE -------
  const addEntry = async (dateStr, content) => {
    setLoading(true);
    try {
      const token = await getToken();
      const lines = content.split("\n").map((text) => ({ text })); // extend if you track timestamps
      const { data } = await createDiaryEntry(
        { dateStr, content, lines },
        token
      );
      setEntries((prev) => {
        const next = [...prev, data];
        localStorage.setItem(DIARY_CACHE_LS_KEY, JSON.stringify(next));
        return next;
      });
      toast.success("Saved!");
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ------- UPDATE -------
  const updateEntry = async (entryId, content) => {
    setLoading(true);
    try {
      const token = await getToken();
      const lines = content.split("\n").map((text) => ({ text }));
      const { data } = await updateDiaryEntry(
        entryId,
        { content, lines },
        token
      );
      setEntries((prev) => {
        const next = prev.map((e) => (e._id === entryId ? data : e));
        localStorage.setItem(DIARY_CACHE_LS_KEY, JSON.stringify(next));
        return next;
      });
      toast.success("Saved!");
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ------- DELETE -------
  const removeEntry = async (entryId) => {
    setLoading(true);
    try {
      const token = await getToken();
      await deleteDiaryEntry(entryId, token);
      setEntries((prev) => {
        const next = prev.filter((e) => e._id !== entryId);
        localStorage.setItem(DIARY_CACHE_LS_KEY, JSON.stringify(next));
        return next;
      });
      toast.success("Entry deleted");
    } catch {
      toast.error("Failed to delete entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DiaryContext.Provider
      value={{
        entries, // All entries, sorted
        getEntryByDateStr,
        addEntry,
        updateEntry,
        removeEntry,
        loadEntries,
        loading,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => useContext(DiaryContext);

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import {
//   fetchDiaryEntryByDate,
//   createDiaryEntry,
//   updateDiaryEntry,
// } from "../apis";
// import { AuthContext } from "./AuthContext";
// import { toast } from "react-toastify";

// export const DiaryContext = createContext();

// export const DiaryProvider = ({ children }) => {
//   const { user, getToken } = useContext(AuthContext);

//   // For current-page/month diary experience, you only need the selected entry:
//   const [entry, setEntry] = useState(null); // { _id, dateStr, content, ... }
//   const [loading, setLoading] = useState(false);

//   const getEntryForDate = useCallback(
//     async (dateStr) => {
//       if (!user || !dateStr) return setEntry(null);
//       setLoading(true);
//       try {
//         const token = await getToken();
//         const { data } = await fetchDiaryEntryByDate(dateStr, token);
//         setEntry(data.length > 0 ? data[0] : null);
//       } catch (err) {
//         toast.error("Failed to fetch diary entry.");
//         setEntry(null);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [user, getToken]
//   );

//   // Saving (create or update?)
//   const saveEntry = useCallback(
//     async (dateStr, content) => {
//       if (!user || !dateStr) return;

//       const lines = content.split("\n").map((text) => ({ text })); // if you want lines with timestamps, modify accordingly
//       try {
//         const token = await getToken();
//         if (!entry) {
//           // Create
//           const { data } = await createDiaryEntry(
//             { dateStr, content, lines },
//             token
//           );
//           setEntry(data);
//         } else {
//           // Update
//           const { data } = await updateDiaryEntry(
//             entry._id,
//             { content, lines },
//             token
//           );
//           setEntry(data);
//         }
//         toast.success("Saved!");
//         return true;
//       } catch (err) {
//         if (err.response?.status === 409)
//           toast.error("Entry for this day already exists.");
//         else toast.error("Failed to save diary entry.");
//         return false;
//       }
//     },
//     [user, getToken, entry]
//   );

//   return (
//     <DiaryContext.Provider
//       value={{
//         loading,
//         entry,
//         setEntry,
//         getEntryForDate,
//         saveEntry,
//       }}
//     >
//       {children}
//     </DiaryContext.Provider>
//   );
// };

// // Helper for components
// export const useDiary = () => useContext(DiaryContext);
