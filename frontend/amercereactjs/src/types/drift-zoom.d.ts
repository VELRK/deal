declare module "drift-zoom" {
  export interface DriftOptions {
    paneContainer?: HTMLElement | null;
    zoomFactor?: number;
    inlinePane?: boolean;
    handleTouch?: boolean;
    hoverBoundingBox?: boolean;
    containInline?: boolean;
  }

  export default class Drift {
    constructor(triggerElement: HTMLElement, options?: DriftOptions);
    destroy(): void;
  }
}
