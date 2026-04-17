"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Card, CardColor } from "@/lib/types";

const COLOR_LABELS: Record<CardColor, { label: string; bg: string; text: string }> = {
  default: { label: "",        bg: "transparent",  text: "transparent" },
  red:     { label: "URGENTE", bg: "#ff2b2b",      text: "white" },
  yellow:  { label: "EN PAUSA",bg: "#f59e0b",      text: "#0a0a0a" },
  green:   { label: "LISTO",   bg: "#16a34a",      text: "white" },
  blue:    { label: "REVISAR", bg: "#2563eb",      text: "white" },
  purple:  { label: "IDEA",    bg: "#7c3aed",      text: "white" },
};

interface Props {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  overlay?: boolean;
}

export default function CardItem({ card, onEdit, onDelete, overlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.2 : 1,
  };

  const tag = COLOR_LABELS[card.color];

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        {...listeners}
        style={{ cursor: "grab" }}
        className="group"
      >
        <div
          style={{ padding: "14px 16px", userSelect: "none", background: "white", border: "2px solid #0a0a0a", boxShadow: "3px 3px 0 #0a0a0a", transition: "transform 0.1s, box-shadow 0.1s" }}
          onMouseEnter={(e) => { const el = e.currentTarget; el.style.transform = "translate(-2px,-2px)"; el.style.boxShadow = "5px 5px 0 #0a0a0a"; }}
          onMouseLeave={(e) => { const el = e.currentTarget; el.style.transform = ""; el.style.boxShadow = "3px 3px 0 #0a0a0a"; }}
        >
          {/* Tag */}
          {tag.bg !== "transparent" && (
            <div style={{ marginBottom: 8 }}>
              <span
                className="mono"
                style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: tag.bg, color: tag.text, padding: "2px 6px" }}
              >
                {tag.label}
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a", lineHeight: 1.4, flex: 1 }}>
              {card.title}
            </span>
            <div
              style={{ display: "flex", gap: 4, opacity: 0, transition: "opacity 0.1s", flexShrink: 0 }}
              className="group-hover:!opacity-100"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(card)}
                className="mono"
                style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #0a0a0a", background: "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#0a0a0a"; }}
              >
                ✎
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="mono"
                style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #0a0a0a", background: "white", cursor: "pointer", fontFamily: "inherit", transition: "all 0.1s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff2b2b"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#ff2b2b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#0a0a0a"; e.currentTarget.style.borderColor = "#0a0a0a"; }}
              >
                ✕
              </button>
            </div>
          </div>

          {card.description && (
            <p style={{ fontSize: 12, color: "#555", marginTop: 8, lineHeight: 1.65 }}>
              {card.description}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
