import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import './document.css';
import styles from './index.module.scss';
import { Grid } from './Grid/Grid';
import { Controls } from './Controls/Controls';
import { IControlFunctions } from './ControlFunctions';

export const App: React.FC = () => {
  const controlFunctions = useRef<IControlFunctions>({});
  
  const N = 3;
  return <div className={styles.app}>
    <Grid N={N} controlFunctions={controlFunctions}/>
    <Controls N={N} controlFunctions={controlFunctions}/>
  </div>
}

// Inject
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
