import React, { useEffect, useState } from "react";
import { instantiateGrid, shuffle, solveGrid } from "../Sudoku/Sudoku";
import styles from './Grid.module.scss';
var classNames = require('classnames');

export interface GridProps {
    N: number;
}

export const Grid: React.FC<GridProps> = ({ N }) => {
    const [ grid, setGrid ] = useState(instantiateGrid(N))
    
    useEffect(() => {
        setGrid(curr => {
            const newGrid = {N: curr.N, grid: curr.grid.map(a => a.slice())}
            solveGrid(newGrid, true);
            console.log(newGrid);
            return newGrid;
        });
    }, []);

    let cn = classNames();

    // Row by row
    return <div className={styles.grid}>
        {grid.grid.map((row, rowIdx) => <div className={styles.row} key={rowIdx}>{
            row.map((cell, colIdx) => {
                let cn = classNames(
                    styles.cell,
                    {[styles.cell_top_border_soft]: rowIdx % grid.N !== 0},
                    {[styles.cell_left_border_soft]: colIdx % grid.N !== 0},
                    {[styles.cell_top_border_hard]: rowIdx % grid.N == 0},
                    {[styles.cell_left_border_hard]: colIdx % grid.N == 0}, 
                );
                return <div className={cn} key={`${rowIdx} ${colIdx}`}>
                    {cell.value}
                </div>}
            )
        }</div>)}
    </div>
}