import React from "react";
import { Star, Tag } from "lucide-react";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onClick,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-200"
    >
      <div className="relative">
        <img
          src={game.imageUrl}
          alt={game.title}
          className="w-full h-32 object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";
          }}
        />
        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {game.score}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
          {game.title}
        </h3>

        <div className="flex flex-wrap gap-1 mb-2">
          {game.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              <Tag className="w-2 h-2" />
              {tag}
            </span>
          ))}
          {game.tags.length > 2 && (
            <span className="text-xs text-gray-500">
              +{game.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
