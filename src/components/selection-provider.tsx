"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SELECTION_STORAGE_KEY } from "@/lib/constants";
import { uniqueStrings } from "@/lib/format";

type SelectionContextValue = {
  selectedIds: string[];
  selectedSet: ReadonlySet<string>;
  selectedCount: number;
  isReady: boolean;
  toggle: (recordId: string) => void;
  selectMany: (recordIds: string[]) => void;
  deselectMany: (recordIds: string[]) => void;
  replace: (recordIds: string[]) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);
const EMPTY_STORAGE_SNAPSHOT = "";
const SELECTION_CHANGE_EVENT = "alr:selection-change";

function sanitizeRecordIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return uniqueStrings(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean),
  ).slice(0, 300);
}

function parseSelectionSnapshot(rawValue: string): string[] {
  try {
    return rawValue ? sanitizeRecordIds(JSON.parse(rawValue) as unknown) : [];
  } catch {
    return [];
  }
}

function getClientSelectionSnapshot(): string {
  try {
    return window.localStorage.getItem(SELECTION_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSelectionSnapshot(): string {
  return EMPTY_STORAGE_SNAPSHOT;
}

function subscribeToSelection(listener: () => void): () => void {
  function handleStorage(event: StorageEvent): void {
    if (event.key === SELECTION_STORAGE_KEY) {
      listener();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SELECTION_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SELECTION_CHANGE_EVENT, listener);
  };
}

function writeSelection(recordIds: string[]): void {
  const serialized = JSON.stringify(sanitizeRecordIds(recordIds));

  try {
    window.localStorage.setItem(SELECTION_STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(SELECTION_CHANGE_EVENT));
  } catch {
    // localStorage가 차단된 환경에서는 선택 상태를 영구 저장하지 않습니다.
  }
}

function subscribeToHydration(): () => void {
  return () => undefined;
}

function getClientHydrationSnapshot(): boolean {
  return true;
}

function getServerHydrationSnapshot(): boolean {
  return false;
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const selectionSnapshot = useSyncExternalStore(
    subscribeToSelection,
    getClientSelectionSnapshot,
    getServerSelectionSnapshot,
  );
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const selectedIds = useMemo(
    () => parseSelectionSnapshot(selectionSnapshot),
    [selectionSnapshot],
  );

  const toggle = useCallback(
    (recordId: string) => {
      writeSelection(
        selectedIds.includes(recordId)
          ? selectedIds.filter((id) => id !== recordId)
          : [...selectedIds, recordId],
      );
    },
    [selectedIds],
  );

  const selectMany = useCallback(
    (recordIds: string[]) => {
      writeSelection(uniqueStrings([...selectedIds, ...recordIds]));
    },
    [selectedIds],
  );

  const deselectMany = useCallback(
    (recordIds: string[]) => {
      const target = new Set(recordIds);
      writeSelection(selectedIds.filter((id) => !target.has(id)));
    },
    [selectedIds],
  );

  const replace = useCallback((recordIds: string[]) => {
    writeSelection(recordIds);
  }, []);

  const clear = useCallback(() => writeSelection([]), []);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedIds,
      selectedSet,
      selectedCount: selectedIds.length,
      isReady,
      toggle,
      selectMany,
      deselectMany,
      replace,
      clear,
    }),
    [
      selectedIds,
      selectedSet,
      isReady,
      toggle,
      selectMany,
      deselectMany,
      replace,
      clear,
    ],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within SelectionProvider");
  }

  return context;
}
