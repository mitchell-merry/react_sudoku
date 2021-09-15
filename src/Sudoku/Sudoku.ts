// Static means generated - unchanging
// Solved means when you press "solve" it was filled in for you
// Null means either empty or filled by the user (default)
export type CellState = 'static' | 'solved' | null;

// ICell, IGrid, I Fard, I Shid
export interface ICell {
    value: number | null;
    state: CellState;
    marks: boolean[];
}

export interface IGrid {
    N: number; // N is the size of a box. The grid is a 3x3 set of boxes, essentially 3N by 3N.
    grid: ICell[][];
};

export type Coordinate = [row: number, col: number];

const isUniqueCellSet = (cells: ICell[]): boolean => {
    const found: number[] = [];

    for(const cell of cells) {
        if(cell.value === null) continue;

        // Duplicate found
        if(found.some(c => c === cell.value)) return false;
        
        // If not already found, add it to the list
        found.push(cell.value!);
    }

    return true;
}

// Expanded from one-liners for readability
const getRow = (grid: IGrid, row: number): ICell[] => {
    const o: ICell[] = [];
    for(let col = 0; col < grid.N*grid.N; col++) o.push(grid.grid[row][col]);
    return o;
};

const getCol = (grid: IGrid, col: number): ICell[] => {
    const o: ICell[] = [];
    for(let row = 0; row < grid.N*grid.N; row++) o.push(grid.grid[row][col]);
    return o;
};

const getBox = (grid: IGrid, boxRow: number, boxCol: number): ICell[] => {
    const o: ICell[] = [];
    for(let i = 0; i < grid.N*grid.N; i++) {
        const [row, col] = [boxRow*grid.N+Math.floor(i/grid.N), boxCol*grid.N+i%grid.N];
        o.push(grid.grid[row][col]);
    }
    return o;
};

export const getCellBox = (cell: Coordinate, N: number): Coordinate => {
    return [ Math.floor(cell[0]/N), Math.floor(cell[1]/N) ];
}

export const inSameBox = (one: Coordinate, two: Coordinate, N: number): boolean => {
    const [boxOne, boxTwo] = [getCellBox(one, N), getCellBox(two, N)];
    return boxOne[0] === boxTwo[0] && boxOne[1] === boxTwo[1];
}

export const cellsInSameRegion = (one: Coordinate, two: Coordinate, N: number): boolean => {
    return one[0] === two[0] || one[1] === two[1] || inSameBox(one, two, N);
}

export const coordinatesEqual = (one: Coordinate, two: Coordinate): boolean => {
    return one[0] === two[0] && one[1] === two[1];
}

export const getValueAtCoordinate = (coord: Coordinate, grid: IGrid): number | null => {
    return grid.grid[coord[0]][coord[1]].value;
}

export const cellValuesEqual = (one: Coordinate, two: Coordinate, grid: IGrid): boolean => {
    const [valueOne, valueTwo] = [getValueAtCoordinate(one, grid), getValueAtCoordinate(two, grid)]
    return valueOne !== null && valueOne === valueTwo;
}

export const coordOOBOnGrid = (coord: Coordinate, grid: IGrid): boolean => {
    return coord[0] < 0 || coord[1] < 0 || coord[0] >= grid.grid.length || coord[1] >= grid.grid[coord[0]].length;
}

export const sumCoordinates = (one: Coordinate, two: Coordinate): Coordinate => {
    return [one[0] + two[0], one[1] + two[1]];
}

export const getAllCoordinates = (grid: IGrid): Coordinate[] => {
    return Array.from({length: grid.N * grid.N*grid.N * grid.N}, (_, i) => [Math.floor(i/(grid.N*grid.N)), i%(grid.N*grid.N)]);
}

export const validGrid = (grid: IGrid): boolean => {
    // validate rows
    for(let row = 0; row < grid.N*grid.N; row++) {
        if(!isUniqueCellSet(getRow(grid, row))) return false;
    }

    // validate cols
    for(let col = 0; col < grid.N*grid.N; col++) {
        if(!isUniqueCellSet(getCol(grid, col))) return false;
    }

    // validate boxes
    for(let i = 0; i < grid.N*grid.N; i++) {
        if(!isUniqueCellSet(getBox(grid, Math.floor(i/grid.N), i%grid.N))) return false;
    }

    return true;
}

const valueFrequencyInSet = (arr: ICell[], value: number | null): number => {
    let o = 0;
    arr.forEach(i => {
        if(i.value === value) o++;
    })
    
    return o;
}

export const isCoordinateValidOnGrid = (grid: IGrid, coord: Coordinate): boolean => {
    return valueFrequencyInSet(getRow(grid, coord[0]), getValueAtCoordinate(coord, grid)) <= 1
        && valueFrequencyInSet(getCol(grid, coord[1]), getValueAtCoordinate(coord, grid)) <= 1
        && valueFrequencyInSet(getBox(grid, getCellBox(coord, grid.N)[0], getCellBox(coord, grid.N)[1]), getValueAtCoordinate(coord, grid)) <= 1;
}

// get co-ordinates of first empty cell in a grid (or null)
export const getEmpty = (grid: IGrid): [number, number] | null => {
    for(let row = 0; row < grid.grid.length; row++) {
        for(let col = 0; col < grid.grid[row].length; col++) {
            if(grid.grid[row][col].value === null) return [row, col];
        }
    }
    return null;
}

export const getEmptyMarks = (N: number): boolean[] => Array.from({length: N*N}, (_, i) => false);

export const clearGridOfState = (grid: IGrid, state: CellState) => {
    grid.grid.forEach((row, rowIdx) => {
        grid.grid[rowIdx].forEach((cell, colIdx) => {
            if(grid.grid[rowIdx][colIdx].state === state) grid.grid[rowIdx][colIdx] = {value: null, state: null, marks: getEmptyMarks(grid.N)}; 
        });
    });
}

// in place and returns the array
export const shuffle = (arr: any[]): any[] => {
    for (let i = arr.length-1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const fillGrid = (grid: IGrid, generate: boolean, countAll: boolean): number => {
    // TODO: keep track of empty cells in IGrid rather than re-calcing on every recurse
    const empty = getEmpty(grid);
    if(empty === null) return 1;

    const [row, col] = empty;
    let solutionsFromHere = 0;

    // possible values for cell
    const options: number[] = Array.from({length: grid.N*grid.N}, (_, i) => i+1); 
    if(generate) shuffle(options);

    for(const option of options) {
        grid.grid[row][col] = {
            value: option,
            state: generate ? 'static' : 'solved',
            marks: grid.grid[row][col].marks
        };

        if(!validGrid(grid)) continue;
        const sols = fillGrid(grid, generate, countAll);
        
        if(!countAll && sols === 1) return sols;

        solutionsFromHere += sols;
    }

    grid.grid[row][col] = {
        value: null,
        state: null,
        marks: grid.grid[row][col].marks
    };
    
    return solutionsFromHere;
}

export const generateGrid = (grid: IGrid, emptyCells: number): void => {

    // Generate solved state and work backwards
    fillGrid(grid, true, false);

    const options: Coordinate[] = shuffle(getAllCoordinates(grid));
    
    // While there are more empty cells to remove and we haven't run out of options
    while(emptyCells > 0 && options.length > 0) {

        // Remove the cell at our first (random) location and store temporarily
        const temp = grid.grid[options[0][0]][options[0][1]].value;
        grid.grid[options[0][0]][options[0][1]] = {value: null, state: null, marks: getEmptyMarks(grid.N)};
        
        // Not a valid solution
        if(fillGrid(grid, false, true) !== 1) {
            // Restore value if it introduces ambiguity
            grid.grid[options[0][0]][options[0][1]] = {value: temp, state: 'static', marks: getEmptyMarks(grid.N)};
        } else {
            // Decrease the number of empty cells (remaining)
            emptyCells--;

            // Clear the board of solved cells (they would have been filled in when we checked)
            clearGridOfState(grid, 'solved');
        }

        // Remove the option
        options.shift();
    }

    console.log(grid)
}

export const instantiateGrid = (N: number): IGrid => {
    return {
        N,
        grid: Array.from({length: N*N}, (_, row) => (
            Array.from({length: N*N}, (_, col) => ({ value: null, state: null, marks: getEmptyMarks(N) }))
        ))
    }
}

export const copyGrid = (grid: IGrid): IGrid => {
    return {
        N: grid.N, 
        grid: grid.grid.map(a => a.slice())
    }
}