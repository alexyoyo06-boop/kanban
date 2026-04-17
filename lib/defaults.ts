import { BoardState } from "./types";

export const DEFAULT_BOARD: BoardState = {
  columns: [
    { id: "col-1", title: "Por hacer", cardIds: ["card-1", "card-2"] },
    { id: "col-2", title: "En progreso", cardIds: ["card-3"] },
    { id: "col-3", title: "Hecho", cardIds: ["card-4"] },
  ],
  cards: {
    "card-1": { id: "card-1", title: "Diseñar wireframes", description: "Bocetos iniciales para la pantalla principal", color: "blue", createdAt: Date.now() },
    "card-2": { id: "card-2", title: "Revisar dependencias", color: "default", createdAt: Date.now() },
    "card-3": { id: "card-3", title: "Implementar drag & drop", description: "Usar dnd-kit para mover tarjetas entre columnas", color: "yellow", createdAt: Date.now() },
    "card-4": { id: "card-4", title: "Setup del proyecto", description: "Next.js + TypeScript + Tailwind", color: "green", createdAt: Date.now() },
  },
};
