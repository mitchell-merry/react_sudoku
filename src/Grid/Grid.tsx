import React, { useEffect, useState } from "react";
import { cellsInSameRegion, Coordinate, coordinatesEqual, generateGrid, instantiateGrid, solveGrid } from "../Sudoku/Sudoku";
import styles from './Grid.module.scss';
var classNames = require('classnames');

export interface GridProps {
    N: number;
}

export const Grid: React.FC<GridProps> = ({ N }) => {
    const [ grid, setGrid ] = useState(instantiateGrid(N))
    const [ selectedCell, setSelectedCell ] = useState<Coordinate>([0, 0]);

    useEffect(() => {
        // setGrid(curr => {
        //     const newGrid = {N: curr.N, grid: curr.grid.map(a => a.slice())}
        //     solveGrid(newGrid, true, false);
        //     return newGrid;
        // });
    }, []);

    const selectCell = (rowIdx: number, colIdx: number): void => {
        setSelectedCell(currentCell => [rowIdx, colIdx]);
    }

    // Row by row
    return <div className={styles.grid}>
        {grid.grid.map((row, rowIdx) => <div className={styles.row} key={rowIdx}>{
            row.map((cell, colIdx) => {
                // state === 2 - selected coordinate
                // state === 1 - same region (row, col, or box)
                // state === 0 - unrelated cell
                const state = coordinatesEqual(selectedCell, [rowIdx, colIdx]) ? 2 
                            : (cellsInSameRegion(selectedCell, [rowIdx, colIdx], grid.N) ? 1
                            : 0);
                            
                let cn = classNames(
                    // Base style
                    styles.cell,

                    // Selected cell and region
                    {[styles.selected_region]: state === 1},
                    {[styles.selected_cell]: state === 2},

                    // Borders
                    {[styles.cell_top_border_soft]: rowIdx % grid.N !== 0},
                    {[styles.cell_left_border_soft]: colIdx % grid.N !== 0},
                    {[styles.cell_top_border_hard]: rowIdx % grid.N === 0},
                    {[styles.cell_left_border_hard]: colIdx % grid.N === 0}, 
                );
                
                return <div className={cn} key={`${rowIdx} ${colIdx}`} onMouseDown={() => selectCell(rowIdx, colIdx)}>
                    {cell.value}
                </div>}
            )
        }</div>)}
    </div>
}