// src/presentation/store/UserProfileContext.spec.tsx
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import React, { useEffect } from "react";
import { UserProfileProvider, useUserProfile } from "./UserProfileContext";

const TestComponent = () => {
  const { name, age, emergencyContact, setName, setAge, setEmergencyContact } =
    useUserProfile();

  return (
    <div>
      <span data-testid="profile-name">{name}</span>
      <span data-testid="profile-age">{age}</span>
      <span data-testid="profile-contact">{emergencyContact}</span>

      <button onClick={() => setName("João Silva")}>Mudar Nome</button>
      <button onClick={() => setAge("75")}>Mudar Idade</button>
      <button onClick={() => setEmergencyContact("912345678")}>
        Mudar Contato
      </button>
    </div>
  );
};

describe("UserProfileContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("deve carregar com valores vazios por defeito", () => {
    render(
      <UserProfileProvider>
        <TestComponent />
      </UserProfileProvider>,
    );

    expect(screen.getByTestId("profile-name").textContent).toBe("");
    expect(screen.getByTestId("profile-age").textContent).toBe("");
  });

  it("deve carregar os dados da localStorage ao montar (simulando que o utilizador já lá tinha estado)", () => {
    // Colocamos dados no LocalStorage ANTES de renderizar a app
    localStorage.setItem(
      "@SeniorEase:userProfile",
      JSON.stringify({
        name: "Maria José",
        age: "80",
        emergencyContact: "112",
      }),
    );

    render(
      <UserProfileProvider>
        <TestComponent />
      </UserProfileProvider>,
    );

    // Verifica se o Provider leu o LocalStorage e atualizou o estado
    expect(screen.getByTestId("profile-name").textContent).toBe("Maria José");
    expect(screen.getByTestId("profile-age").textContent).toBe("80");
    expect(screen.getByTestId("profile-contact").textContent).toBe("112");
  });

  it("deve gravar os dados na localStorage quando são alterados", () => {
    render(
      <UserProfileProvider>
        <TestComponent />
      </UserProfileProvider>,
    );

    // Simulamos os cliques
    act(() => {
      screen.getByText("Mudar Nome").click();
      screen.getByText("Mudar Idade").click();
    });

    // Validamos se os dados foram para a localStorage corretamente
    const stored = localStorage.getItem("@SeniorEase:userProfile");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);

    expect(parsed.name).toBe("João Silva");
    expect(parsed.age).toBe("75");
  });
});
