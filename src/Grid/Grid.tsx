import React, { useEffect, useState } from "react";
import { IControlFunctions } from "../ControlFunctions";
import * as Sudoku from "../Sudoku/Sudoku";
import styles from './Grid.module.scss';
var classNames = require('classnames');

export interface GridProps {
    N: number;
    controlFunctions: React.MutableRefObject<IControlFunctions>;
}

interface ATM { [key: string]: Sudoku.Coordinate }

const arrowToNeighbour: ATM = {
    'ArrowUp':      [-1, 0],
    'ArrowDown':    [1, 0],
    'ArrowLeft':    [0, -1],
    'ArrowRight':   [0, 1],
};

export const Grid: React.FC<GridProps> = ({ N, controlFunctions }) => {
    const [ grid, setGrid ] = useState(Sudoku.instantiateGrid(N))
    const [ selectedCell, setSelectedCell ] = useState<Sudoku.Coordinate>([0, 0]);
    const [ editModeEnabled, setEditModeEnabled ] = useState<boolean>(true);
    
    const generateNewGrid = (): void => {
        setGrid(curr => {
            const newGrid = Sudoku.instantiateGrid(curr.N);
            Sudoku.generateGrid(newGrid, 45);
            return newGrid;
        });
    }

    const solveGrid = (): void => {
        setGrid(curr => {
            const newGrid = Sudoku.copyGrid(curr);
            Sudoku.fillGrid(newGrid, false, false);
            return newGrid;
        });
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
        const val = Number(e.key);
        if(!isNaN(val) && e.key !== ' ') {
            e.preventDefault();    
            setCellValue(selectedCell[0], selectedCell[1], val);
        } else if(Object.keys(arrowToNeighbour).includes(e.key)) {
            setSelectedCell(currentSelectedCell => {
                const newCell = Sudoku.sumCoordinates(currentSelectedCell, arrowToNeighbour[e.key]);
                if(Sudoku.coordOOBOnGrid(newCell, grid)) return currentSelectedCell
                return newCell;
            })
        } 
        else if(e.key === 'Delete' || e.key === 'Backspace') setCellValue(selectedCell[0], selectedCell[1], null);
        else if(e.key === ' ') solveGrid(); 
        else {
            // console.log(e.key);
        }
    }

    useEffect(() => { generateNewGrid(); }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [ selectedCell, ]);

    const selectCell = (row: number, col: number): void => {
        setSelectedCell(currentCell => [row, col]);
    }

    const setCellValue = (row: number, col: number, value: number | null): void => {
        setGrid(curr => {
            const newGrid = Sudoku.copyGrid(curr);

            if(newGrid.grid[row][col].state !== 'static') {

                if(!editModeEnabled) {
                    const currVal = Sudoku.getValueAtCoordinate([row, col], newGrid);
                    if(currVal === value || value === 0) newGrid.grid[row][col].value = null;
                    else newGrid.grid[row][col].value = value;
                } else if(value !== null && value !== 0) {
                    newGrid.grid[row][col].marks[value-1] = !newGrid.grid[row][col].marks[value-1];
                }
            }
            
            return newGrid;
        });
    }

    controlFunctions.current.generate = generateNewGrid;
    controlFunctions.current.solve = solveGrid;
    controlFunctions.current.loadCell = (value: number) => { setCellValue(selectedCell[0], selectedCell[1], value); }

    // Row by row
    return <div className={styles.grid}>
        {grid.grid.map((row, rowIdx) => <div className={styles.row} key={rowIdx}>{
            row.map((cell, colIdx) => {
                
                const shade = Sudoku.coordinatesEqual(selectedCell, [rowIdx, colIdx]) ? 'coordinate'
                            : Sudoku.cellValuesEqual(selectedCell, [rowIdx, colIdx], grid) ? 'number'
                            : Sudoku.cellsInSameRegion(selectedCell, [rowIdx, colIdx], grid.N) ? 'region'
                            : null;

                const state = Sudoku.isCoordinateValidOnGrid(grid, [rowIdx, colIdx]) ? cell.state
                            : 'invalid';
                            
                let cn = classNames(
                    // Base style
                    styles.cell,

                    // Selected cell and region
                    {[styles.selected_cell]: shade === 'coordinate'},
                    {[styles.selected_number]: shade === 'number'},
                    {[styles.selected_region]: shade === 'region'},

                    // Cell type
                    {[styles.cell_static]: state === 'static'},
                    {[styles.cell_solved]: state === 'solved'},
                    {[styles.cell_invalid]: state === 'invalid'},

                    // Borders
                    {[styles.cell_top_border_soft]: rowIdx % grid.N !== 0},
                    {[styles.cell_left_border_soft]: colIdx % grid.N !== 0},
                    {[styles.cell_top_border_hard]: rowIdx % grid.N === 0},
                    {[styles.cell_left_border_hard]: colIdx % grid.N === 0}, 
                );
                
                return <div className={cn} key={`${rowIdx} ${colIdx}`} onMouseDown={() => selectCell(rowIdx, colIdx)}>
                    {cell.value !== null ? cell.value : Array.from({ length: grid.N }, (_, row) => <div className={styles.mark_row}>
                        {Array.from({ length: grid.N }, (_, col) => <div className={styles.mark_cell}>
                            {cell.marks[row*grid.N+col] ? (row*grid.N+col)+1 : ' '}
                        </div>)}
                    </div>)}
                </div>}
            )
        }</div>)}
    </div>
}