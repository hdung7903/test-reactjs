declare module 'js-cookie' {
    interface CookieAttributes {
      expires?: number | Date | undefined;
      path?: string | undefined;
      domain?: string | undefined;
      secure?: boolean | undefined;
      sameSite?: 'strict' | 'lax' | 'none' | undefined;
    }
  
    interface CookiesStatic {
      get(name: string): string | undefined;
      get(): { [key: string]: string };
      set(name: string, value: string | object, options?: CookieAttributes): void;
      remove(name: string, options?: CookieAttributes): void;
    }
  
    const Cookies: CookiesStatic;
    export default Cookies;
  }
  