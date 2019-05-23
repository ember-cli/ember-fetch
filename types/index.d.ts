declare module "@ember/debug" {
  // tslint:disable-next-line:strict-export-declare-modifiers
  interface DeprecationOptions {
    id: string;
    until: string;
    url?: string;
  }

  /**
   * Display a deprecation warning with the provided message and a stack trace
   * (Chrome and Firefox only).
   */
  export function deprecate(
      message: string,
      test: boolean,
      options: DeprecationOptions
  ): any;
}