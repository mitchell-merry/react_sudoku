// ICell, IGrid, I Fard, I Shid
export interface ICell {
    value: number | null;
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

// get co-ordinates of first empty cell in a grid (or null)
const getEmpty = (grid: IGrid): [number, number] | null => {
    for(let row = 0; row < grid.grid.length; row++) {
        for(let col = 0; col < grid.grid[row].length; col++) {
            if(grid.grid[row][col].value === null) return [row, col];
        }
    }
    return null;
}

const getCellBox = (cell: Coordinate, N: number): Coordinate => {
    return [ Math.floor(cell[0]/N), Math.floor(cell[1]/N) ];
}

const inSameBox = (one: Coordinate, two: Coordinate, N: number): boolean => {
    const [boxOne, boxTwo] = [getCellBox(one, N), getCellBox(two, N)];
    return boxOne[0] === boxTwo[0] && boxOne[1] === boxTwo[1];
}

export const cellsInSameRegion = (one: Coordinate, two: Coordinate, N: number): boolean => {
    return one[0] === two[0] || one[1] === two[1] || inSameBox(one, two, N);
}

export const coordinatesEqual = (one: Coordinate, two: Coordinate): boolean => {
    return one[0] === two[0] && one[1] === two[1];
}

// in place and returns the array
export const shuffle = (arr: any[]): any[] => {
    for (let i = arr.length-1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const solveGrid = (grid: IGrid, random: boolean, countAll: boolean): number => {
    // TODO: keep track of empty cells in IGrid rather than re-calcing on every recurse
    const empty = getEmpty(grid);
    if(empty === null) return 1;

    const [row, col] = empty;
    let solutionsFromHere = 0;

    // possible values for cell
    const options: number[] = Array.from({length: grid.N*grid.N}, (_, i) => i+1); 
    if(random) shuffle(options);

    for(const option of options) {
        grid.grid[row][col].value = option;

        if(!validGrid(grid)) continue;
        const sols = solveGrid(grid, random, countAll);
        
        if(!countAll && sols === 1) return sols;

        solutionsFromHere += sols;
    }

    grid.grid[row][col].value = null;
    return solutionsFromHere;
}

export const generateGrid = (grid: IGrid, emptyCells: number) => {

    // Generate solved state and work backwards
    console.log(solveGrid(grid, false, true));


}

export const instantiateGrid = (N: number): IGrid => {
    return {
        N,
        grid: Array.from({length: N*N}, (_, row) => (
            Array.from({length: N*N}, (_, col) => ({value: null}))
        ))
    }
}