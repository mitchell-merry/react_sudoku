export interface IControlFunctions {
    loadCell?: (value: number) => void;
    generate?: () => void;
    solve?: () => void;
    reset?: () => void;
    setEdit?: (val: boolean) => void;
};