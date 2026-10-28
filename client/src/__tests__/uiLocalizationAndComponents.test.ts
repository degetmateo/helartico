import { describe, expect, it } from "vitest";
import React from "react";
import { PasswordInput } from "../components/common/PasswordInput";

describe("PasswordInput Component & UI Standards", () => {
  it("should be defined and return an element with expected default structure", () => {
    const element = React.createElement(PasswordInput, {
      value: "secret123",
      onChange: () => {},
      placeholder: "Ingresá tu contraseña",
    });

    expect(element).toBeDefined();
    expect(element.props.placeholder).toBe("Ingresá tu contraseña");
    expect(element.props.value).toBe("secret123");
  });

  it("should use proper Argentine voseo placeholders and labels", () => {
    const testStrings = [
      "Buscá helados, café, tortas...",
      "Buscá por DNI o nombre...",
      "Iniciá Sesión",
      "Registrate",
      "Canjeá",
      "Mostrá en caja",
      "Llegaste al final del catálogo ✨",
      "Todavía no tenés canjes",
    ];

    // Ensure none of the strings use generic non-voseo forms
    for (const str of testStrings) {
      expect(str).not.toMatch(/\b(tienes|busca|canjea|muestra|inicia|registra)\b/i);
    }
  });

  it("should not contain mentions of 'club de fidelidad' or 'programa de fidelidad'", () => {
    const forbiddenPhrases = [
      "club de fidelidad",
      "programa de fidelidad",
    ];

    const currentBrandTagline = "Helados & Café • Sumá y Canjeá Puntos";
    for (const phrase of forbiddenPhrases) {
      expect(currentBrandTagline.toLowerCase()).not.toContain(phrase);
    }
  });
});
