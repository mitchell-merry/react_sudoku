import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './document.css';
import styles from './index.module.scss';
import { Grid } from './Grid/Grid';
import { Controls } from './Controls/Controls';
import { IControlFunctions } from './ControlFunctions';

export const App: React.FC = () => {
  const controlFunctions = useRef<IControlFunctions>({ });
  const [ editMode, setEditMode ] = useState<boolean>(false);

  const toggleEditMode = () => { setEditMode(e => !e); }
  
  const N = 3;
  return <div className={styles.app}>
    <Grid N={N} controlFunctions={controlFunctions} editMode={editMode} toggleEditMode={toggleEditMode} />
    <Controls N={N} controlFunctions={controlFunctions} editMode={editMode} toggleEditMode={toggleEditMode} />
  </div>
}

// Inject
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
