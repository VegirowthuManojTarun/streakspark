// src/hooks/useTaskCompletions.js
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { toggleTaskCompletion as toggleTaskCompletionAPI } from "../apis";

export const useTaskCompletions = () => {
  const [completions, setCompletions] = useState(new Map());
  const { getToken } = useContext(AuthContext);

  // Load completions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("taskCompletions");
    if (stored) {
      try {
        const { date, completions: storedCompletions } = JSON.parse(stored);
        const today = new Date().toISOString().split("T")[0];

        if (date === today) {
          setCompletions(new Map(storedCompletions));
        } else {
          localStorage.removeItem("taskCompletions");
        }
      } catch (error) {
        console.error("Error loading completions:", error);
      }
    }
  }, []);

  // Save completions to localStorage when they change
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      "taskCompletions",
      JSON.stringify({
        date: today,
        completions: Array.from(completions.entries()),
      })
    );
  }, [completions]);

  const toggleCompletion = async (taskId) => {
    if (!taskId || taskId.startsWith("temp_")) {
      toast.error("Cannot update completion status for unsaved task");
      return;
    }

    try {
      const token = await getToken();
      const isCurrentlyCompleted = completions.get(taskId);

      // Optimistic update
      setCompletions((prev) => {
        const next = new Map(prev);
        next.set(taskId, !isCurrentlyCompleted);
        return next;
      });

      // Update server
      await toggleTaskCompletionAPI(taskId, !isCurrentlyCompleted, token);
    } catch (error) {
      // Revert on error
      setCompletions((prev) => {
        const next = new Map(prev);
        next.set(taskId, completions.get(taskId));
        return next;
      });

      console.error("Toggle completion error:", error);
      toast.error("Failed to update task completion status");
    }
  };

  return {
    completions,
    toggleCompletion,
    isCompleted: (taskId) => completions.get(taskId) || false,
  };
};
