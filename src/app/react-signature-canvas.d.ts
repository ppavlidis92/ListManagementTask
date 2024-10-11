declare module 'react-signature-canvas' {
  import React from 'react';

  export interface SignaturePadProps {
    canvasProps?: React.HTMLProps<HTMLCanvasElement>;
    clear?: () => void;
    fromDataURL?: (dataURL: string, options?: object) => void;
    toDataURL?: (type?: string, encoderOptions?: number) => string;
    onEnd?: () => void;
    onBegin?: () => void;
  }

  export default class SignaturePad extends React.Component<SignaturePadProps> {
    clear(): void;
    getTrimmedCanvas(): HTMLCanvasElement;
    fromDataURL(base64String: string, options?: { ratio?: number }): void;
    toDataURL(type?: string, encoderOptions?: number): string;
  }
}
