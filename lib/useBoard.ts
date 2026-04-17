"use client";

import { useReducer, useEffect } from "react";
import { BoardState, Card, CardColor, Column } from "./types";
import { DEFAULT_BOARD } from "./defaults";

type Action =
  | { type: "MOVE_CARD"; cardId: string; fromCol: string; toCol: string; toIndex: number }
  | { type: "ADD_CARD"; columnId: string; title: string; description?: string; color: CardColor }
  | { type: "DELETE_CARD"; cardId: string; columnId: string }
  | { type: "UPDATE_CARD"; cardId: string; title: string; description?: string; color: CardColor }
  | { type: "ADD_COLUMN"; title: string }
  | { type: "DELETE_COLUMN"; columnId: string }
  | { type: "RENAME_COLUMN"; columnId: string; title: string }
  | { type: "LOAD"; state: BoardState };

function reducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "LOAD":
      return action.state;

    case "MOVE_CARD": {
      const { cardId, fromCol, toCol, toIndex } = action;
      const cols = state.columns.map((col) => {
        if (col.id === fromCol) return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
        if (col.id === toCol) {
          const ids = col.cardIds.filter((id) => id !== cardId);
          ids.splice(toIndex, 0, cardId);
          return { ...col, cardIds: ids };
        }
        return col;
      });
      return { ...state, columns: cols };
    }

    case "ADD_CARD": {
      const id = `card-${Date.now()}`;
      const card: Card = { id, title: action.title, description: action.description, color: action.color, createdAt: Date.now() };
      const cols = state.columns.map((col) =>
        col.id === action.columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      );
      return { ...state, columns: cols, cards: { ...state.cards, [id]: card } };
    }

    case "DELETE_CARD": {
      const { [action.cardId]: _, ...rest } = state.cards;
      const cols = state.columns.map((col) =>
        col.id === action.columnId ? { ...col, cardIds: col.cardIds.filter((id) => id !== action.cardId) } : col
      );
      return { ...state, columns: cols, cards: rest };
    }

    case "UPDATE_CARD": {
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.cardId]: { ...state.cards[action.cardId], title: action.title, description: action.description, color: action.color },
        },
      };
    }

    case "ADD_COLUMN": {
      const col: Column = { id: `col-${Date.now()}`, title: action.title, cardIds: [] };
      return { ...state, columns: [...state.columns, col] };
    }

    case "DELETE_COLUMN": {
      const col = state.columns.find((c) => c.id === action.columnId);
      if (!col) return state;
      const cards = { ...state.cards };
      col.cardIds.forEach((id) => delete cards[id]);
      return { ...state, columns: state.columns.filter((c) => c.id !== action.columnId), cards };
    }

    case "RENAME_COLUMN":
      return { ...state, columns: state.columns.map((c) => c.id === action.columnId ? { ...c, title: action.title } : c) };

    default:
      return state;
  }
}

const STORAGE_KEY = "kanban-board-v1";

export function useBoard() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_BOARD);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD", state: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
