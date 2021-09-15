import React from "react";

export interface IControlFunctions {
    loadCell?: (value: number) => void;
    generate?: () => void;
    solve?: () => void;
    reset?: () => void;
};