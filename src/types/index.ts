export interface Game {
  id: string;
  title: string;
  description: string;
  tags: string[];
  score: number;
  imageUrl: string;
  review: string;
}

export interface Column {
  id: string;
  title: string;
  gameIds: string[];
}

export interface DragItem {
  type: "GAME";
  gameId: string;
  sourceColumnId: string;
}
