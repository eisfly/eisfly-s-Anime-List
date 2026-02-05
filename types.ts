export enum Category {
  MUST_WATCH = "Must Watch Anime",
  GOATS = "Goats of Anime",
  PEAK = "Peak of Anime",
  GOOD = "Good Anime",
  NOTHING_ELSE = "Anime to Watch When There’s Nothing Else",
  SPORTS = "Sports Anime",
  UNDERRATED = "Underrated Anime",
  UNKNOWN = "More Unknown Anime"
}

export type AnimeCategory = 
  | "Must Watch Anime"
  | "Goats of Anime"
  | "Peak of Anime"
  | "Good Anime"
  | "Anime to Watch When There’s Nothing Else"
  | "Sports Anime"
  | "Underrated Anime"
  | "More Unknown Anime";

export interface Anime {
  id: string;
  title: string;
  category: AnimeCategory | Category;
  genres: string[];
  description: string;
  coverImageURL: string;
  releaseYear: number;
  status: "Finished" | "Ongoing";
  trailerUrl?: string;
}