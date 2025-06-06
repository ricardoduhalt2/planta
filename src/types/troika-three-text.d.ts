// Type definitions for troika-three-text

declare module 'troika-three-text' {
  import { Mesh, MeshBasicMaterial, BufferGeometry, Object3D } from 'three';

  export interface TextParameters {
    text?: string;
    anchorX?: number | 'left' | 'center' | 'right';
    anchorY?: number | 'top' | 'top-baseline' | 'top-cap' | 'top-ex' | 'middle' | 'bottom-baseline' | 'bottom';
    clipRect?: [number, number, number, number] | null;
    color?: string | number;
    depthOffset?: number;
    direction?: 'auto' | 'ltr' | 'rtl';
    fillOpacity?: number;
    font?: string;
    fontSize?: number;
    glyphGeometryDetail?: number;
    gpuAccelerateSDF?: boolean;
    lineHeight?: number | string;
    maxWidth?: number;
    outlineBlur?: number | string;
    outlineColor?: string | number;
    outlineOffsetX?: number | string;
    outlineOffsetY?: number | string;
    outlineOpacity?: number;
    outlineWidth?: number | string;
    overflowWrap?: 'normal' | 'break-word';
    sdfGlyphSize?: number | null;
    shadowBlur?: number | string | null;
    shadowColor?: string | number;
    shadowOffsetX?: number | string;
    shadowOffsetY?: number | string;
    strokeColor?: string | number;
    strokeOpacity?: number;
    strokeWidth?: number | string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textIndent?: number;
    whiteSpace?: 'normal' | 'nowrap';
    letterSpacing?: number;
    onSync?: (troikaText: Object3D) => void;
  }

  export class Text extends Mesh<BufferGeometry, MeshBasicMaterial> {
    text: string;
    anchorX: number | 'left' | 'center' | 'right';
    anchorY: number | 'top' | 'top-baseline' | 'top-cap' | 'top-ex' | 'middle' | 'bottom-baseline' | 'bottom';
    clipRect: [number, number, number, number] | null;
    color: string | number;
    depthOffset: number;
    direction: 'auto' | 'ltr' | 'rtl';
    fillOpacity: number;
    font: string;
    fontSize: number;
    glyphGeometryDetail: number;
    gpuAccelerateSDF: boolean;
    lineHeight: number | string;
    maxWidth: number;
    outlineBlur: number | string;
    outlineColor: string | number;
    outlineOffsetX: number | string;
    outlineOffsetY: number | string;
    outlineOpacity: number;
    outlineWidth: number | string;
    overflowWrap: 'normal' | 'break-word';
    sdfGlyphSize: number | null;
    shadowBlur: number | string | null;
    shadowColor: string | number;
    shadowOffsetX: number | string;
    shadowOffsetY: number | string;
    strokeColor: string | number;
    strokeOpacity: number;
    strokeWidth: number | string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    textIndent: number;
    whiteSpace: 'normal' | 'nowrap';
    letterSpacing: number;
    onSync: (troikaText: Object3D) => void;

    constructor(parameters?: TextParameters);
    sync(callback?: (troikaText: Object3D) => void): void;
    dispose(): void;
  }

  export function preloadFont(
    font: string | { [key: string]: any },
    characters?: string,
    onProgress?: (progress: number) => void
  ): Promise<void>;

  export function createTextDerivedMaterial(
    baseMaterial: any,
    options?: {
      customSDF?: string;
    }
  ): any;

  export function getCaretAtPoint(
    text: string,
    x: number,
    y: number,
    params?: TextParameters
  ): { index: number; x: number; y: number; height: number } | null;

  export function measureText(
    text: string,
    params?: TextParameters
  ): {
    width: number;
    height: number;
    lineHeight: number;
    lineWidths: number[];
    lineCount: number;
    maxLineLength: number;
    maxLineWidth: number;
    basePositionY: number;
  };

  export function configureTextBuilder(
    options: {
      sdfGlyphSize?: number;
      fontAtlasTextureSize?: number;
      fontAtlasCacheSize?: number;
    }
  ): void;

  export function disposeCachedSDFTextures(): void;

  export function getTextRenderInfo(
    text: string,
    params?: TextParameters
  ): any; // This is a complex type, you might want to define it more precisely

  export function getRenderedGlyphBounds(
    text: string,
    params?: TextParameters,
    target?: { minX: number; minY: number; maxX: number; maxY: number }
  ): { minX: number; minY: number; maxX: number; maxY: number };

  export function getRenderedGlyphVieportBounds(
    text: string,
    camera: any,
    params?: TextParameters
  ): { minX: number; minY: number; maxX: number; maxY: number } | null;

  export function getTextRenderOrder(
    text: string,
    params?: TextParameters
  ): number[];

  export function getTextRenderRange(
    text: string,
    params?: TextParameters
  ): { start: number; end: number };

  export function getTextRenderStyle(
    text: string,
    params?: TextParameters
  ): any; // This is a complex type, you might want to define it more precisely

  export function getTextRenderTransform(
    text: string,
    params?: TextParameters
  ): any; // This is a complex type, you might want to define it more precisely

  export function getTextRenderUvTransform(
    text: string,
    params?: TextParameters
  ): any; // This is a complex type, you might want to define it more precisely

  export function getTextRenderUvs(
    text: string,
    params?: TextParameters
  ): Float32Array;

  export function getTextRenderVertices(
    text: string,
    params?: TextParameters
  ): Float32Array;

  export function getTextRenderIndices(
    text: string,
    params?: TextParameters
  ): Uint16Array | Uint32Array;

  export function getTextRenderBoundingBox(
    text: string,
    params?: TextParameters,
    target?: { minX: number; minY: number; maxX: number; maxY: number }
  ): { minX: number; minY: number; maxX: number; maxY: number };

  export function getTextRenderGlyphBounds(
    text: string,
    params?: TextParameters,
    target?: { minX: number; minY: number; maxX: number; maxY: number }
  ): { minX: number; minY: number; maxX: number; maxY: number };

  export function getTextRenderLineBounds(
    text: string,
    lineIndex: number,
    params?: TextParameters,
    target?: { minX: number; minY: number; maxX: number; maxY: number }
  ): { minX: number; minY: number; maxX: number; maxY: number } | null;

  export function getTextRenderSelectionRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderGlyphRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderLineRects(
    text: string,
    startLine: number,
    endLine: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderCharRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderWordRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderLinkRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderDecorationRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderBackgroundRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderOutlineRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderShadowRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderStrikethroughRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderUnderlineRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;

  export function getTextRenderOverlineRects(
    text: string,
    startIndex: number,
    endIndex: number,
    params?: TextParameters
  ): Array<{ x: number; y: number; width: number; height: number }>;
}
