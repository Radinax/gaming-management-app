import React from "react";
import { X, Star, Tag, Edit, Trash2 } from "lucide-react";
import type { Game } from "@/types";

interface GameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const GameModal: React.FC<GameModalProps> = ({
  game,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-64 object-cover rounded-t-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-3 py-2 rounded-full font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            {game.score}/10
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{game.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {game.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{game.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Review</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {game.review}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
