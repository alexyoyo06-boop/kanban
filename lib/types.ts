export type CardColor = "default" | "red" | "yellow" | "green" | "blue" | "purple";

export interface Card {
  id: string;
  title: string;
  description?: string;
  color: CardColor;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  columns: Column[];
  cards: Record<string, Card>;
}
