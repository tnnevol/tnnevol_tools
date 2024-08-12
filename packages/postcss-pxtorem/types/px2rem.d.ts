declare module "px2rem" {
  export type Options = {
    baseDpr?: number; // Base device pixel ratio (default: 2)
    remUnit?: number; // REM unit value (default: 75)
    remPrecision?: number; // REM value precision (default: 6)
    forcePxComment?: string; // Force PX comment (default: `px`)
    keepComment?: string; // No transform value comment (default: `no`)
  };

  declare class Px2rem {
    constructor(options: Options): void;

    generateThree(cssText: string, dpr?: number): string;

    generateRem(cssText: string): string;

    _getCalcValue(type: "px" | string, value: string, dpr: number): string;
  }

  export = Px2rem;
}
