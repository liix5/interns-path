/**
 * useFormDraft - A hook for persisting entire multi-step form state to localStorage
 *
 * @description
 * This hook saves the complete form state (all field values + current step) to localStorage,
 * enabling users to recover their progress after accidental page refreshes or navigation.
 *
 * Features:
 * - Saves all form values + current step number as a single draft
 * - Debounced saving (2s after changes stop) to avoid excessive writes
 * - Threshold-based activation: starts saving after user moves past Step 1 OR types 30+ chars
 * - Shows a restoration banner with preview of saved description
 * - "Continue where you left off" restores all fields AND jumps to the saved step
 * - Clears draft on successful form submission
 *
 * @example
 * ```tsx
 * const formDraft = useFormDraft({
 *   key: "experience_form",
 *   formValues: watch(),
 *   currentStep,
 *   totalSteps: 4,
 *   descriptionField: "description",
 *   onRestore: (values, step) => {
 *     reset(values);
 *     setCurrentStep(step);
 *   },
 * });
 *
 * // In JSX:
 * {formDraft.showBanner && (
 *   <DraftBanner
 *     preview={formDraft.draftPreview}
 *     currentStep={formDraft.draftStep}
 *     totalSteps={formDraft.totalSteps}
 *     onRestore={formDraft.restore}
 *     onDiscard={formDraft.discard}
 *   />
 * )}
 * ```
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const DEBOUNCE_MS = 2000; // save every 2 seconds after changes stop
const PREVIEW_LENGTH = 150; // chars to show in banner preview
const MIN_STEP_TO_SAVE = 1; // start saving after user moves past Step 1 (index 0)
const MIN_DESCRIPTION_LENGTH = 30; // or if they've typed this much in description

interface FormDraftData<T> {
  values: T;
  currentStep: number;
  savedAt: number;
}

interface UseFormDraftOptions<T> {
  key: string; // unique key for this form, e.g., "experience_form"
  formValues: T; // current form values
  currentStep: number; // current step index
  totalSteps: number; // total number of steps
  descriptionField?: string; // name of the description field for preview
  onRestore: (values: T, step: number) => void; // callback to restore form
}

interface UseFormDraftReturn<T> {
  hasDraft: boolean;
  draftPreview: string;
  draftStep: number;
  totalSteps: number;
  showBanner: boolean;
  restore: () => void;
  discard: () => void;
  clearDraft: () => void;
}

export function useFormDraft<T extends Record<string, any>>({
  key,
  formValues,
  currentStep,
  totalSteps,
  descriptionField = "description",
  onRestore,
}: UseFormDraftOptions<T>): UseFormDraftReturn<T> {
  const [draftData, setDraftData] = useState<FormDraftData<T> | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [hasRestored, setHasRestored] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(`formDraft_${key}`);
    if (stored) {
      try {
        const parsed: FormDraftData<T> = JSON.parse(stored);
        // Only show banner if draft has meaningful content
        const description = parsed.values[descriptionField] || "";
        const hasProgress = parsed.currentStep > 0 || description.length >= MIN_DESCRIPTION_LENGTH;

        if (hasProgress) {
          setDraftData(parsed);
          setShowBanner(true);
        }
      } catch {
        localStorage.removeItem(`formDraft_${key}`);
      }
    }

    isInitialized.current = true;
  }, [key, descriptionField]);

  // Debounced save - save when user has made meaningful progress
  useEffect(() => {
    if (!isInitialized.current) return;
    if (typeof window === "undefined") return;
    if (hasRestored === false && showBanner) return; // Don't overwrite draft while banner is showing

    const description = formValues[descriptionField] || "";
    const shouldSave = currentStep >= MIN_STEP_TO_SAVE || description.length >= MIN_DESCRIPTION_LENGTH;

    if (!shouldSave) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const newDraft: FormDraftData<T> = {
        values: formValues,
        currentStep,
        savedAt: Date.now(),
      };
      localStorage.setItem(`formDraft_${key}`, JSON.stringify(newDraft));
      setDraftData(newDraft);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formValues, currentStep, key, descriptionField, showBanner, hasRestored]);

  // Restore draft content to form
  const restore = useCallback(() => {
    if (draftData) {
      onRestore(draftData.values, draftData.currentStep);
      setShowBanner(false);
      setHasRestored(true);
    }
  }, [draftData, onRestore]);

  // Discard draft and clear localStorage
  const discard = useCallback(() => {
    localStorage.removeItem(`formDraft_${key}`);
    setDraftData(null);
    setShowBanner(false);
    setHasRestored(true); // Allow saving new content
  }, [key]);

  // Clear draft on successful form submission
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`formDraft_${key}`);
    setDraftData(null);
    setShowBanner(false);
  }, [key]);

  // Generate preview from description field
  const description = draftData?.values[descriptionField] || "";
  const draftPreview = description.length > PREVIEW_LENGTH
    ? description.slice(0, PREVIEW_LENGTH) + "..."
    : description;

  return {
    hasDraft: !!draftData,
    draftPreview,
    draftStep: draftData?.currentStep ?? 0,
    totalSteps,
    showBanner,
    restore,
    discard,
    clearDraft,
  };
}
