export enum AppState {
  ASKING = 'ASKING',
  SUCCESS = 'SUCCESS',
}

export interface FallingItem {
  id: number;
  left: number;
  animationDuration: number;
  delay: number;
  content: string; // Emoji
  size: number;
}

export interface FloatingHeart {
  id: number;
  left: number;
  top: number;
  scale: number;
  animationDuration: number;
}