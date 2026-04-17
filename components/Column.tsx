"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { Card, Column as ColumnType } from "@/lib/types";
import CardItem from "./CardItem";

interface Props {
  column: ColumnType;
  cards: Card[];
  onAddCard: (columnId: string) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
}

export default function Column({ column, cards, onAddCard, onEditCard, onDeleteCard, onDeleteColumn, onRenameColumn }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const submitRename = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) onRenameColumn(column.id, trimmed);
    else setTitle(column.title);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: "flex", flexDirection: "column", width: 300, flexShrink: 0 }}
    >
      <div
        style={{
          border: "2px solid #0a0a0a",
          background: isOver ? "#e0ddd6" : "#f2f0eb",
          transition: "background 0.15s",
        }}
      >
        {/* Header */}
        <div
          style={{ background: "#0a0a0a", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          className="group/col"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            {editing ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={submitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") { setTitle(column.title); setEditing(false); }
                }}
                style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, color: "white", outline: "none", width: "100%", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.05em" }}
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="mono"
                style={{ fontSize: 12, fontWeight: 700, color: "white", background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ff2b2b")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              >
                {column.title}
              </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: "#ff2b2b", fontWeight: 700 }}>
              {String(cards.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => onDeleteColumn(column.id)}
              className="mono opacity-0 group-hover/col:!opacity-100"
              style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", transition: "color 0.1s", padding: "2px 4px" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ff2b2b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cards area */}
        <div
          ref={setNodeRef}
          style={{ padding: "12px", minHeight: 80, display: "flex", flexDirection: "column", gap: 8 }}
        >
          <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {cards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  onEdit={onEditCard}
                  onDelete={(id) => onDeleteCard(id, column.id)}
                />
              ))}
            </AnimatePresence>
          </SortableContext>

          {cards.length === 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60 }}>
              <span className="mono" style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.08em" }}>
                — VACÍO —
              </span>
            </div>
          )}
        </div>

        {/* Add card */}
        <div style={{ borderTop: "1px solid #e5e3de", padding: "8px 12px" }}>
          <button
            onClick={() => onAddCard(column.id)}
            style={{
              width: "100%", background: "transparent", border: "1px dashed #bbb",
              padding: "8px", fontSize: 12, fontWeight: 600,
              color: "#888", cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.1s", letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; e.currentTarget.style.color = "#0a0a0a"; e.currentTarget.style.background = "var(--bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "transparent"; }}
          >
            + AÑADIR TARJETA
          </button>
        </div>
      </div>
    </motion.div>
  );
}
