/**
 * useDraftStorage - A hook for persisting individual form field values to localStorage
 *
 * @description
 * This hook provides field-level draft storage for expensive text inputs (like long
 * descriptions). It's designed for cases where you want to save a single field
 * independently, rather than the entire form state.
 *
 * Features:
 * - Debounced saving (2s after typing stops)
 * - Threshold-based replacement: old draft is replaced after user types 50+ new chars
 * - Shows a restoration banner with truncated preview (150 chars)
 * - Explicit restore/discard actions - no silent auto-fill
 * - Clears draft on successful form submission
 *
 * Note: For multi-step forms, prefer `useFormDraft` which saves the entire form
 * state + current step. This hook is better suited for single-field scenarios
 * or non-wizard forms.
 *
 * @example
 * ```tsx
 * const draft = useDraftStorage({
 *   key: "blog_post_content",
 *   currentValue: watch("content"),
 *   onRestore: (value) => setValue("content", value),
 * });
 *
 * // In JSX:
 * {draft.showBanner && (
 *   <DraftBanner
 *     preview={draft.draftPreview}
 *     onRestore={draft.restore}
 *     onDiscard={draft.discard}
 *   />
 * )}
 * ```
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const DRAFT_THRESHOLD = 50; // chars before we replace old draft with new content
const DEBOUNCE_MS = 2000; // save every 2 seconds after typing stops
const PREVIEW_LENGTH = 150; // chars to show in banner preview

interface DraftData {
  content: string;
  savedAt: number;
}

interface UseDraftStorageOptions {
  key: string; // unique key for this field, e.g., "experience_description"
  currentValue: string; // current field value from form
  onRestore: (value: string) => void; // callback to set form value
}

interface UseDraftStorageReturn {
  hasDraft: boolean;
  draftPreview: string;
  draftSavedAt: Date | null;
  showBanner: boolean;
  restore: () => void;
  discard: () => void;
  clearDraft: () => void; // call on successful form submission
}

export function useDraftStorage({
  key,
  currentValue,
  onRestore,
}: UseDraftStorageOptions): UseDraftStorageReturn {
  const [draftData, setDraftData] = useState<DraftData | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [initialValue, setInitialValue] = useState<string>("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const hasPassedThreshold = useRef(false);
  const isInitialized = useRef(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(`draft_${key}`);
    if (stored) {
      try {
        const parsed: DraftData = JSON.parse(stored);
        if (parsed.content && parsed.content.length > 0) {
          setDraftData(parsed);
          setShowBanner(true);
        }
      } catch {
        localStorage.removeItem(`draft_${key}`);
      }
    }

    // Store the initial value when component mounts
    setInitialValue(currentValue);
    isInitialized.current = true;
  }, [key]); // Only run on mount, not when currentValue changes

  // Track typing and handle threshold-based replacement
  useEffect(() => {
    if (!isInitialized.current) return;
    if (typeof window === "undefined") return;

    // Calculate how many NEW chars user has typed (beyond initial value)
    const newCharsTyped = currentValue.length - initialValue.length;

    // If user has typed enough new content, they've committed to fresh writing
    if (newCharsTyped >= DRAFT_THRESHOLD && !hasPassedThreshold.current) {
      hasPassedThreshold.current = true;
      setShowBanner(false);
      // Old draft will be replaced by new content on next save
    }

    // Debounced save - only save if user has typed something meaningful
    // OR if they've passed the threshold (to keep saving new content)
    if (hasPassedThreshold.current || currentValue.length >= DRAFT_THRESHOLD) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (currentValue.length > 0) {
          const newDraft: DraftData = {
            content: currentValue,
            savedAt: Date.now(),
          };
          localStorage.setItem(`draft_${key}`, JSON.stringify(newDraft));
          setDraftData(newDraft);
        }
      }, DEBOUNCE_MS);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [currentValue, key, initialValue]);

  // Restore draft content to form
  const restore = useCallback(() => {
    if (draftData?.content) {
      onRestore(draftData.content);
      setShowBanner(false);
      // After restore, update initial value so threshold tracking works correctly
      setInitialValue(draftData.content);
      hasPassedThreshold.current = false;
    }
  }, [draftData, onRestore]);

  // Discard draft and clear localStorage
  const discard = useCallback(() => {
    localStorage.removeItem(`draft_${key}`);
    setDraftData(null);
    setShowBanner(false);
    hasPassedThreshold.current = true; // Start saving new content immediately
    setInitialValue(currentValue); // Reset baseline
  }, [key, currentValue]);

  // Clear draft on successful form submission
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`draft_${key}`);
    setDraftData(null);
    setShowBanner(false);
    hasPassedThreshold.current = false;
  }, [key]);

  // Generate preview (truncated)
  const draftPreview = draftData?.content
    ? draftData.content.length > PREVIEW_LENGTH
      ? draftData.content.slice(0, PREVIEW_LENGTH) + "..."
      : draftData.content
    : "";

  return {
    hasDraft: !!draftData?.content,
    draftPreview,
    draftSavedAt: draftData?.savedAt ? new Date(draftData.savedAt) : null,
    showBanner,
    restore,
    discard,
    clearDraft,
  };
}

// Utility to clear all drafts for a form (call on successful submission)
export function clearAllDrafts(keys: string[]) {
  if (typeof window === "undefined") return;
  keys.forEach((key) => {
    localStorage.removeItem(`draft_${key}`);
  });
}
