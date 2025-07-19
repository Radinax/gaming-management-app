import React, { useState, useCallback } from "react";
import { Plus, Gamepad2 } from "lucide-react";
import type { Game, Column as ColumnType } from "@/types";
import { useLocalStorage } from "@/hooks/use-localstorage";
import Column from "@/components/column";
import GameModal from "@/components/game-modal";
import GameForm from "@/components/game-form";
import ColumnForm from "@/components/column-form";

const GameBoard: React.FC = () => {
  const [games, setGames] = useLocalStorage<Record<string, Game>>(
    "jrpg-games",
    {}
  );
  const [columns, setColumns] = useLocalStorage<ColumnType[]>("jrpg-columns", [
    { id: "storytelling", title: "Storytelling Masters", gameIds: [] },
    { id: "gameplay", title: "Gameplay Innovation", gameIds: [] },
    { id: "classics", title: "Timeless Classics", gameIds: [] },
  ]);

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);
  const [showGameForm, setShowGameForm] = useState(false);
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [draggedGame, setDraggedGame] = useState<{
    gameId: string;
    sourceColumnId: string;
  } | null>(null);
  const [targetColumn, setTargetColumn] = useState<string | null>(null);

  // Game management
  const saveGame = useCallback(
    (gameData: Omit<Game, "id">) => {
      const id = editingGame?.id || `game-${Date.now()}`;
      const game: Game = { ...gameData, id };

      setGames((prev) => ({ ...prev, [id]: game }));

      if (!editingGame && targetColumn) {
        setColumns((prev) =>
          prev.map((col) =>
            col.id === targetColumn
              ? { ...col, gameIds: [...col.gameIds, id] }
              : col
          )
        );
      }

      setShowGameForm(false);
      setEditingGame(null);
      setTargetColumn(null);
    },
    [editingGame, targetColumn, setGames, setColumns]
  );

  const deleteGame = useCallback(
    (gameId: string) => {
      setGames((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [gameId]: deleted, ...rest } = prev;
        return rest;
      });

      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          gameIds: col.gameIds.filter((id) => id !== gameId),
        }))
      );

      setSelectedGame(null);
    },
    [setGames, setColumns]
  );

  // Column management
  const saveColumn = useCallback(
    (title: string) => {
      if (editingColumn) {
        setColumns((prev) =>
          prev.map((col) =>
            col.id === editingColumn.id ? { ...col, title } : col
          )
        );
      } else {
        const newColumn: ColumnType = {
          id: `column-${Date.now()}`,
          title,
          gameIds: [],
        };
        setColumns((prev) => [...prev, newColumn]);
      }

      setShowColumnForm(false);
      setEditingColumn(null);
    },
    [editingColumn, setColumns]
  );

  const deleteColumn = useCallback(
    (columnId: string) => {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    },
    [setColumns]
  );

  // Drag and drop
  const handleDragStart = useCallback(
    (gameId: string, sourceColumnId: string) => {
      setDraggedGame({ gameId, sourceColumnId });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedGame(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetColumnId: string) => {
      e.preventDefault();

      if (!draggedGame) return;

      const { gameId, sourceColumnId } = draggedGame;

      if (sourceColumnId === targetColumnId) return;

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              gameIds: col.gameIds.filter((id) => id !== gameId),
            };
          }
          if (col.id === targetColumnId) {
            return { ...col, gameIds: [...col.gameIds, gameId] };
          }
          return col;
        })
      );

      setDraggedGame(null);
    },
    [draggedGame, setColumns]
  );

  const getColumnGames = useCallback(
    (column: ColumnType): Game[] => {
      return column.gameIds.map((id) => games[id]).filter(Boolean);
    },
    [games]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              JRPG Game Board
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowGameForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Game
            </button>
            <button
              onClick={() => setShowColumnForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Column
            </button>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              games={getColumnGames(column)}
              onGameClick={setSelectedGame}
              onEditColumn={() => {
                setEditingColumn(column);
                setShowColumnForm(true);
              }}
              onDeleteColumn={() => deleteColumn(column.id)}
              onAddGame={() => {
                setTargetColumn(column.id);
                setShowGameForm(true);
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            />
          ))}
        </div>

        {/* Modals */}
        {selectedGame && (
          <GameModal
            game={selectedGame}
            isOpen={true}
            onClose={() => setSelectedGame(null)}
            onEdit={() => {
              setEditingGame(selectedGame);
              setShowGameForm(true);
              setSelectedGame(null);
            }}
            onDelete={() => deleteGame(selectedGame.id)}
          />
        )}

        <GameForm
          game={editingGame}
          isOpen={showGameForm}
          onClose={() => {
            setShowGameForm(false);
            setEditingGame(null);
            setTargetColumn(null);
          }}
          onSave={saveGame}
        />

        <ColumnForm
          column={editingColumn}
          isOpen={showColumnForm}
          onClose={() => {
            setShowColumnForm(false);
            setEditingColumn(null);
          }}
          onSave={saveColumn}
        />
      </div>
    </div>
  );
};

export default GameBoard;
