<div align="center">

# Kanban

**Tablero Kanban con arrastrar y soltar, construido con Next.js y React.**

Organiza tareas en columnas, arrástralas entre estados y edítalas al vuelo. Todo en el navegador, sin backend.

</div>

---

## Qué hace

- 🗂️ **Columnas y tarjetas** al estilo Trello — crear, renombrar y eliminar columnas; crear, editar y borrar tarjetas.
- 🖱️ **Arrastrar y soltar** fluido entre columnas y reordenamiento dentro de una columna, con [`@dnd-kit`](https://dndkit.com).
- 🎨 **Tarjetas con colores** (6 etiquetas) y descripción, editables desde un modal.
- 💾 **Persistencia local** — el tablero se guarda en el navegador, así que no pierdes tu trabajo al recargar.
- ✨ **Animaciones** suaves con Framer Motion.

## Stack

| Área | Tecnología |
|------|-----------|
| Framework | Next.js 16 · React 19 · TypeScript |
| Drag & drop | @dnd-kit (core · sortable · utilities) |
| Estado | `useReducer` + persistencia local |
| Animación | Framer Motion |
| Estilos | Tailwind CSS v4 |

## Cómo funciona por dentro

Todo el estado del tablero vive en un `useReducer` centralizado en [`lib/useBoard.ts`](lib/useBoard.ts), con acciones tipadas (`MOVE_CARD`, `ADD_CARD`, `UPDATE_CARD`, `ADD_COLUMN`…) y persistencia automática. Los tipos del dominio (`Card`, `Column`, `BoardState`) están en [`lib/types.ts`](lib/types.ts), y la UI se divide en [`Column`](components/Column.tsx), [`CardItem`](components/CardItem.tsx) y [`CardModal`](components/CardModal.tsx).

## Ejecutar en local

```bash
git clone https://github.com/alexyoyo06-boop/kanban.git
cd kanban
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

<div align="center">
Desarrollado por <a href="https://github.com/alexyoyo06-boop">Alex García Marcos</a>
</div>
