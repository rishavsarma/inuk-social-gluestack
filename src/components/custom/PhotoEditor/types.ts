export interface EditorState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  filter: string; // 'none' | 'sepia' | 'grayscale' | 'vintage' | 'negative' | 'warm' | 'cool'
  pixelate: number; // 1 to 50, 1 means off
  radialPixelAngle: number; // 0 to 0.5, 0 means off
  radialPixelRadius: number; // 0 to 30, 0 means off
  liquidStrength: number; // 0 to 30, 0 means off
  liquidFrequency: number; // default 10
}

export interface StickerItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface TextItem {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawPath {
  id: string;
  points: Point[];
  color: string;
  strokeWidth: number;
  type: 'free' | 'rect' | 'circle' | 'arrow';
}

export type EditorTab =
  | 'transform'
  | 'adjust'
  | 'filters'
  | 'effects'
  | 'blur'
  | 'stickers'
  | 'text'
  | 'draw';

export interface PhotoEditorProps {
  visible: boolean;
  imageUri: string;
  initialFilter?: string;
  onClose: () => void;
  onSave: (editedUri: string, filterId: string) => void;
}
