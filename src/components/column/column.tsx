import React from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import type { Column as ColumnType, Game } from "@/types";
import GameCard from "@/components/game-card";

interface ColumnProps {
  column: ColumnType;
  games: Game[];
  onGameClick: (game: Game) => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onAddGame: () => void;
  onDragStart: (gameId: string, columnId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  games,
  onGameClick,
  onEditColumn,
  onDeleteColumn,
  onAddGame,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 min-w-80 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{column.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={onAddGame}
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
            title="Add Game"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onEditColumn}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
            title="Edit Column"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDeleteColumn}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
            title="Delete Column"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className="space-y-3 min-h-32"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => onGameClick(game)}
            onDragStart={() => onDragStart(game.id, column.id)}
            onDragEnd={onDragEnd}
          />
        ))}

        {games.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No games yet</p>
            <button
              onClick={onAddGame}
              className="text-indigo-600 hover:text-indigo-700 text-sm mt-1"
            >
              Add your first game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
