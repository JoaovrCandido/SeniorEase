// src/presentation/components/ui/Button.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Componente Button", () => {
  it("deve renderizar o texto corretamente", () => {
    render(<Button variant="primary">Guardar Alterações</Button>);

    // Verifica se o texto "Guardar Alterações" aparece no ecrã do teste
    expect(screen.getByText("Guardar Alterações")).toBeInTheDocument();
  });

  it("deve chamar a função onClick quando clicado", () => {
    const handleClick = vi.fn(); // Cria uma função "espiã"

    render(
      <Button variant="danger" onClick={handleClick}>
        Apagar
      </Button>,
    );

    const buttonElement = screen.getByText("Apagar");
    fireEvent.click(buttonElement); // Simula um clique do rato

    expect(handleClick).toHaveBeenCalledTimes(1); // Valida se a função foi chamada
  });

  it("não deve chamar onClick se o botão estiver desativado", () => {
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        A carregar
      </Button>,
    );

    const buttonElement = screen.getByText("A carregar");
    fireEvent.click(buttonElement);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
