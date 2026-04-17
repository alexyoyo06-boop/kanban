"use client";

import { useState, useCallback } from "react";
import {
  DndContext, DragEndEvent, DragOverEvent, DragOverlay,
  DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { useBoard } from "@/lib/useBoard";
import { Card, CardColor } from "@/lib/types";
import Column from "@/components/Column";
import CardItem from "@/components/CardItem";
import CardModal from "@/components/CardModal";

export default function Home() {
  const { state, dispatch } = useBoard();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; columnId?: string; card?: Card | null }>({ open: false });
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findColumnOfCard = useCallback(
    (cardId: string) => state.columns.find((col) => col.cardIds.includes(cardId))?.id ?? null,
    [state.columns]
  );

  const handleDragStart = ({ active }: DragStartEvent) => setActiveCardId(active.id as string);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const fromCol = findColumnOfCard(activeId);
    const toCol = state.columns.find((c) => c.id === overId)?.id ?? findColumnOfCard(overId);
    if (!fromCol || !toCol || fromCol === toCol) return;
    const toColData = state.columns.find((c) => c.id === toCol);
    const toIndex = toColData?.cardIds.indexOf(overId) ?? -1;
    dispatch({ type: "MOVE_CARD", cardId: activeId, fromCol, toCol, toIndex: toIndex === -1 ? 999 : toIndex });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCardId(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const col = findColumnOfCard(activeId);
    if (!col) return;
    const column = state.columns.find((c) => c.id === col);
    if (!column) return;
    const oldIndex = column.cardIds.indexOf(activeId);
    const newIndex = column.cardIds.indexOf(overId);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      void arrayMove(column.cardIds, oldIndex, newIndex);
      dispatch({ type: "MOVE_CARD", cardId: activeId, fromCol: col, toCol: col, toIndex: newIndex });
    }
  };

  const handleSave = (title: string, description: string, color: CardColor) => {
    if (modal.card) dispatch({ type: "UPDATE_CARD", cardId: modal.card.id, title, description, color });
    else if (modal.columnId) dispatch({ type: "ADD_CARD", columnId: modal.columnId, title, description, color });
  };

  const handleAddColumn = () => {
    const t = newColTitle.trim();
    if (t) dispatch({ type: "ADD_COLUMN", title: t });
    setNewColTitle("");
    setAddingColumn(false);
  };

  const totalCards = state.columns.reduce((a, c) => a + c.cardIds.length, 0);
  const doneCol = state.columns.find((c) => c.title.toLowerCase().includes("hecho"));
  const doneCount = doneCol?.cardIds.length ?? 0;
  const activeCard = activeCardId ? state.cards[activeCardId] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f2f0eb", overflow: "hidden" }}>

      {/* Header */}
      <header style={{ borderBottom: "2px solid #0a0a0a", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg)" }}>
        <span className="mono" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "#0a0a0a" }}>
          KANBAN
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="mono" style={{ fontSize: 11, color: "#888" }}>
            {doneCount}/{totalCards} TAREAS
          </span>
          <span style={{ width: 1, height: 16, background: "#ccc" }} />
          <span className="mono" style={{ fontSize: 11, color: "#ff2b2b", fontWeight: 700 }}>
            DRAG & DROP
          </span>
        </div>
      </header>

      {/* Board */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "24px 20px" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: "flex", gap: 16, height: "100%", alignItems: "flex-start" }}>
            {state.columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={col.cardIds.map((id) => state.cards[id]).filter(Boolean)}
                onAddCard={(columnId) => setModal({ open: true, columnId, card: null })}
                onEditCard={(card) => setModal({ open: true, card })}
                onDeleteCard={(cardId, columnId) => dispatch({ type: "DELETE_CARD", cardId, columnId })}
                onDeleteColumn={(columnId) => dispatch({ type: "DELETE_COLUMN", columnId })}
                onRenameColumn={(columnId, title) => dispatch({ type: "RENAME_COLUMN", columnId, title })}
              />
            ))}

            {/* Add column */}
            <div style={{ width: 300, flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                {addingColumn ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ border: "2px solid #0a0a0a", background: "white", boxShadow: "4px 4px 0 #0a0a0a" }}
                  >
                    <div style={{ background: "#0a0a0a", padding: "10px 14px" }}>
                      <span className="mono" style={{ fontSize: 11, color: "white", fontWeight: 700, letterSpacing: "0.1em" }}>
                        NUEVA COLUMNA
                      </span>
                    </div>
                    <div style={{ padding: 14 }}>
                      <input
                        autoFocus
                        value={newColTitle}
                        onChange={(e) => setNewColTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddColumn(); if (e.key === "Escape") setAddingColumn(false); }}
                        placeholder="Nombre..."
                        style={{ width: "100%", border: "2px solid #0a0a0a", background: "var(--bg)", padding: "8px 12px", fontSize: 13, fontWeight: 600, color: "#0a0a0a", outline: "none", fontFamily: "inherit" }}
                      />
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button
                          onClick={handleAddColumn}
                          className="brutal-btn"
                          style={{ flex: 1, padding: "8px", fontSize: 11, letterSpacing: "0.08em" }}
                        >
                          CREAR →
                        </button>
                        <button
                          onClick={() => setAddingColumn(false)}
                          style={{ padding: "8px 12px", fontSize: 11, background: "transparent", border: "2px solid #0a0a0a", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => setAddingColumn(true)}
                    className="mono"
                    style={{ width: "100%", background: "transparent", border: "2px dashed #bbb", padding: "16px", fontSize: 11, fontWeight: 700, color: "#bbb", cursor: "pointer", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", transition: "all 0.1s" }}
                    whileHover={{ borderColor: "#0a0a0a", color: "#0a0a0a" }}
                  >
                    + NUEVA COLUMNA
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeCard && (
              <div style={{ transform: "rotate(2deg)", width: 300 }}>
                <CardItem card={activeCard} onEdit={() => {}} onDelete={() => {}} overlay />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <CardModal
        open={modal.open}
        card={modal.card}
        onSave={handleSave}
        onClose={() => setModal({ open: false })}
      />
    </div>
  );
}
