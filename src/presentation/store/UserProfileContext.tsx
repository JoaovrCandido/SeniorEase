// src/presentation/store/UserProfileContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserProfileState {
  name: string;
  age: string; // <-- NOVO
  emergencyContact: string;
  setName: (name: string) => void;
  setAge: (age: string) => void; // <-- NOVO
  setEmergencyContact: (contact: string) => void;
}

const defaultState: UserProfileState = {
  name: "",
  age: "",
  emergencyContact: "",
  setName: () => {},
  setAge: () => {},
  setEmergencyContact: () => {},
};

const UserProfileContext = createContext<UserProfileState>(defaultState);
const STORAGE_KEY = "@SeniorEase:userProfile";

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState("");
  const [age, setAgeState] = useState("");
  const [emergencyContact, setEmergencyContactState] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { name?: string; age?: string; emergencyContact?: string };
        if (parsed.name) setNameState(parsed.name);
        if (parsed.age) setAgeState(parsed.age);
        if (parsed.emergencyContact) setEmergencyContactState(parsed.emergencyContact);
      } catch (error) {
        console.error("Erro ao carregar o perfil", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, age, emergencyContact }));
  }, [name, age, emergencyContact, isMounted]);

  return (
    <UserProfileContext.Provider 
      value={{ 
        name, 
        age,
        emergencyContact, 
        setName: setNameState, 
        setAge: setAgeState,
        setEmergencyContact: setEmergencyContactState 
      }}
    >
      {isMounted ? children : null}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error("useUserProfile deve ser usado dentro do UserProfileProvider");
  return context;
};