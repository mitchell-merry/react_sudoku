import { FormControlLabel, Switch } from "@material-ui/core";
import React, { useRef } from "react";
import { IControlFunctions } from "../ControlFunctions";
import styles from './Controls.module.scss';
var classNames = require('classnames');

export interface ControlsProps {
    N: number;
    controlFunctions: React.MutableRefObject<IControlFunctions>;
    editModeState: [editMode: boolean, toggleEditMode: () => void];
    testModeState: [testMode: boolean, toggleTestMode: () => void];
}

export const Controls: React.FC<ControlsProps> = ({ N, controlFunctions, editModeState, testModeState }) => {
    const [ editMode, toggleEditMode ] = editModeState;
    const [ testMode, toggleTestMode ] = testModeState;

    return <div className={styles.grid}>
        <div className={styles.row}>
            <button className={styles.action_button} onClick={() => controlFunctions.current?.generate && controlFunctions.current.generate()}>Generate</button>
            <button className={styles.action_button} onClick={() => controlFunctions.current?.solve && controlFunctions.current.solve()}>Solve</button>
        </div>
        <div className={styles.row}>
            <FormControlLabel
                control={
                <Switch
                    checked={editMode}
                    onChange={toggleEditMode}
                    name="checkedB"
                    color="primary"
                />
                }
                label="Edit"
            />
            <FormControlLabel
                control={
                <Switch
                    checked={testMode}
                    onChange={toggleTestMode}
                    name="checkedB"
                    color="primary"
                />
                }
                label="Test"
            />
        </div>
        {Array.from({length: N}, (_, numberRow) => <div className={styles.row} key={numberRow}>
            {Array.from({length: N}, (_, numberCol) => <div className={styles.cell} key={`${numberRow} ${numberCol}`}>
            <button 
                className={styles.number_button} 
                onClick={() => controlFunctions.current?.loadCell && controlFunctions.current.loadCell(numberRow*N+numberCol+1)} 
                key={numberRow*N+numberCol+1}
            >
                {numberRow*N+numberCol+1}
            </button>
            </div>)}
        </div>)}
    </div>
}