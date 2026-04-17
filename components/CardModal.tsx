"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardColor } from "@/lib/types";

const COLORS: { value: CardColor; label: string; bg: string; text: string }[] = [
  { value: "default", label: "NINGUNO", bg: "#f2f0eb", text: "#0a0a0a" },
  { value: "red",     label: "URGENTE", bg: "#ff2b2b", text: "white" },
  { value: "yellow",  label: "EN PAUSA",bg: "#f59e0b", text: "#0a0a0a" },
  { value: "green",   label: "LISTO",   bg: "#16a34a", text: "white" },
  { value: "blue",    label: "REVISAR", bg: "#2563eb", text: "white" },
  { value: "purple",  label: "IDEA",    bg: "#7c3aed", text: "white" },
];

interface Props {
  open: boolean;
  card?: Card | null;
  onSave: (title: string, description: string, color: CardColor) => void;
  onClose: () => void;
}

export default function CardModal({ open, card, onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState<CardColor>("default");

  useEffect(() => {
    if (open) {
      setTitle(card?.title ?? "");
      setDesc(card?.description ?? "");
      setColor(card?.color ?? "default");
    }
  }, [open, card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), desc.trim(), color);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}
          >
            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 420, background: "#f2f0eb", border: "2px solid #0a0a0a", boxShadow: "6px 6px 0 #0a0a0a" }}
            >
              {/* Modal header */}
              <div style={{ background: "#0a0a0a", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "white", letterSpacing: "0.1em" }}>
                  {card ? "EDITAR TARJETA" : "NUEVA TARJETA"}
                </span>
                <button
                  type="button" onClick={onClose}
                  className="mono"
                  style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ff2b2b")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  ✕ CERRAR
                </button>
              </div>

              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                    TÍTULO
                  </label>
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="¿Qué hay que hacer?"
                    style={{ width: "100%", border: "2px solid #0a0a0a", background: "white", padding: "10px 14px", fontSize: 14, fontWeight: 500, color: "#0a0a0a", outline: "none", fontFamily: "inherit" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                    DESCRIPCIÓN <span style={{ opacity: 0.5, fontWeight: 400 }}>(OPCIONAL)</span>
                  </label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Más contexto..."
                    rows={3}
                    style={{ width: "100%", border: "2px solid #0a0a0a", background: "white", padding: "10px 14px", fontSize: 13, color: "#0a0a0a", outline: "none", fontFamily: "inherit", resize: "none" }}
                  />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                    ETIQUETA
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className="mono"
                        style={{
                          padding: "4px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                          background: color === c.value ? c.bg : "white",
                          color: color === c.value ? c.text : "#888",
                          border: color === c.value ? `2px solid ${c.bg === "#f2f0eb" ? "#0a0a0a" : c.bg}` : "2px solid #ccc",
                          cursor: "pointer", transition: "all 0.1s",
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "2px solid #0a0a0a", padding: "12px 20px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button" onClick={onClose}
                  style={{ padding: "8px 18px", fontSize: 12, fontWeight: 700, background: "transparent", border: "2px solid #0a0a0a", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="brutal-btn"
                  style={{ padding: "8px 20px", fontSize: 12, letterSpacing: "0.05em" }}
                >
                  {card ? "GUARDAR →" : "CREAR →"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
