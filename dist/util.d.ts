interface replacerFunc {
    (obj: any): any;
}
interface replacerObj {
    trueString?: any;
    falseString?: any;
    trueValue?: any;
    falseValue?: any;
}
export declare function mapKeyProp(data: any, keyString: string, defaultValue?: any, replacer?: replacerObj | replacerFunc): any;
export declare function isObject(input: any): boolean;
export {};
