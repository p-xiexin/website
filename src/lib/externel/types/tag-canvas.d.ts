import type { IOptions } from './options';

interface TagCanvasInstance {
  Start: (canvasId: string, tagsId: string, options?: Partial<IOptions>) => boolean;
  Pause: (canvasId: string) => void;
  Resume: (canvasId: string) => void;
  Delete: (canvasId: string) => void;
  TagToFront: (canvasId: string, tagId: string, options?: { time?: number; callback?: () => void }) => void;
  RotateTag: (canvasId: string, tagId: string, options?: { time?: number; callback?: () => void }) => void;
  Update: (canvasId: string) => void;
  SetSpeed: (canvasId: string, speed: number[]) => void;
}

declare global {
  interface Window {
    TagCanvas?: TagCanvasInstance;
  }
}

export {};
