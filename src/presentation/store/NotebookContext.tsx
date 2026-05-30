// src/presentation/store/NotebookContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useNotebook } from "../hooks/useNotebook";
import { useNotifications } from "../hooks/useNotifications";

type NotebookContextType = ReturnType<typeof useNotebook>;

const NotebookContext = createContext<NotebookContextType | undefined>(
  undefined,
);

export const NotebookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const notebookState = useNotebook();

  // As notificações globais rodam aqui! Vão avisar o idoso em qualquer página.
  useNotifications(notebookState.notebooks);

  return (
    <NotebookContext.Provider value={notebookState}>
      {children}
    </NotebookContext.Provider>
  );
};

export const useNotebookContext = () => {
  const context = useContext(NotebookContext);
  if (!context)
    throw new Error(
      "useNotebookContext deve ser usado dentro de NotebookProvider",
    );
  return context;
};
