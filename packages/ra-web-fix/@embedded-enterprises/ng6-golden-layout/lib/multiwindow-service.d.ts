export declare function MultiWindowInit(): void;
export declare type Constructor<T> = {
    new (...args: any[]): T;
};
export declare function MultiWindowService<T>(): (constructor: Constructor<T>) => Constructor<T>;
