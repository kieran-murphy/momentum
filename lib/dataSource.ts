"use client";

import { useEffect, useState } from "react";
import { readLocal, writeLocal } from "./storage";

export type DataSource = "local" | "demo";

const DATA_SOURCE_KEY = "todo.dataSource.v1";
const DATA_SOURCE_EVENT = "todo:datasource-change";

// The demo dataset (and the ability to switch to it) only ever exists in
// dev builds — a production build always uses the visitor's own local
// storage, and ignores/ hides the toggle entirely.
export const canUseDemoData = process.env.NODE_ENV !== "production";

export function getDataSource(): DataSource {
  if (!canUseDemoData) return "local";
  // No saved preference yet means a fresh dev checkout — default it to the
  // demo dataset so there's something to look at without seeding real data.
  return readLocal<DataSource>(DATA_SOURCE_KEY, "demo");
}

export function setDataSource(source: DataSource) {
  if (!canUseDemoData) return;
  writeLocal(DATA_SOURCE_KEY, source);
  window.dispatchEvent(new Event(DATA_SOURCE_EVENT));
}

// Shared by every store hook (and the Settings page) so flipping the toggle
// anywhere updates all of them immediately, without a page navigation to
// force a remount.
export function useDataSource() {
  const [source, setSource] = useState<DataSource>(() => getDataSource());

  useEffect(() => {
    const onChange = () => setSource(getDataSource());
    window.addEventListener(DATA_SOURCE_EVENT, onChange);
    return () => window.removeEventListener(DATA_SOURCE_EVENT, onChange);
  }, []);

  return [source, setDataSource] as const;
}
