import React, { useEffect, useState } from "react";
import * as Sudoku from "../Sudoku/Sudoku";
import styles from './Grid.module.scss';
var classNames = require('classnames');

export interface GridProps {
    N: number;
}

interface ATM { [key: string]: Sudoku.Coordinate }

const arrowToNeighbour: ATM = {
    'ArrowUp':      [-1, 0],
    'ArrowDown':    [1, 0],
    'ArrowLeft':    [0, -1],
    'ArrowRight':   [0, 1],
};

export const Grid: React.FC<GridProps> = ({ N }) => {
    const [ grid, setGrid ] = useState(Sudoku.instantiateGrid(N))
    const [ selectedCell, setSelectedCell ] = useState<Sudoku.Coordinate>([0, 0]);

    const handleKeyDown = (e: KeyboardEvent): void => {
        const val = Number(e.key);
        if(!isNaN(val)) {
            e.preventDefault();    
            setCellValue(selectedCell[0], selectedCell[1], val);
        } else if(Object.keys(arrowToNeighbour).includes(e.key)) {
            setSelectedCell(currentSelectedCell => {
                const newCell = Sudoku.sumCoordinates(currentSelectedCell, arrowToNeighbour[e.key]);
                if(Sudoku.coordOOBOnGrid(newCell, grid)) return currentSelectedCell
                return newCell;
            })
        }
    }

    useEffect(() => {
        setGrid(curr => {
            const newGrid = Sudoku.copyGrid(curr);
            Sudoku.fillGrid(newGrid, true, false);
            return newGrid;
        });


        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [ selectedCell, ]);

    const selectCell = (row: number, col: number): void => {
        setSelectedCell(currentCell => [row, col]);
    }

    const setCellValue = (row: number, col: number, value: number): void => {
        setGrid(curr => {
            const newGrid = Sudoku.copyGrid(curr);

            if(newGrid.grid[row][col].state !== 'static') {
                const currVal = Sudoku.getValueAtCoordinate([row, col], newGrid);
                if(currVal === value) newGrid.grid[row][col].value = null;
                else newGrid.grid[row][col].value = value;
            }
            
            return newGrid;
        });
    }

    // Row by row
    return <div className={styles.grid}>
        {grid.grid.map((row, rowIdx) => <div className={styles.row} key={rowIdx}>{
            row.map((cell, colIdx) => {
                
                const shade = Sudoku.coordinatesEqual(selectedCell, [rowIdx, colIdx]) ? 'coordinate'
                            : Sudoku.cellValuesEqual(selectedCell, [rowIdx, colIdx], grid) ? 'number'
                            : Sudoku.cellsInSameRegion(selectedCell, [rowIdx, colIdx], grid.N) ? 'region'
                            : null;
                            
                let cn = classNames(
                    // Base style
                    styles.cell,

                    // Selected cell and region
                    {[styles.selected_cell]: shade === 'coordinate'},
                    {[styles.selected_number]: shade === 'number'},
                    {[styles.selected_region]: shade === 'region'},

                    // Cell type
                    {[styles.cell_static]: cell.state === 'static'},
                    {[styles.cell_solved]: cell.state === 'solved'},

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