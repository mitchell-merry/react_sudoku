import { Button } from "@material-ui/core";
import React from "react";
import { IControlFunctions } from "../ControlFunctions";
import styles from './Controls.module.scss';
var classNames = require('classnames');

export interface ControlsProps {
    N: number;
    controlFunctions: React.MutableRefObject<IControlFunctions>;
}

export const Controls: React.FC<ControlsProps> = ({ N, controlFunctions }) => {
    let cn = classNames(styles.grid);

    return <div className={cn}>
        <div className={styles.row}>
            <button className={styles.action_button} onClick={() => controlFunctions.current?.generate && controlFunctions.current.generate()}>Generate</button>
            <button className={styles.action_button} onClick={() => controlFunctions.current?.solve && controlFunctions.current.solve()}>Solve</button>
        </div>
        {Array.from({length: N}, (_, r) => <div className={styles.row}>
            {Array.from({length: N}, (_, c) => <div className={styles.cell}>
            <button className={styles.number_button} onClick={() => controlFunctions.current?.loadCell && controlFunctions.current.loadCell(r*N+c+1)}>{r*N+c+1}</button>
            </div>)}
        </div>)}
    </div>
}