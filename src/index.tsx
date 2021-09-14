import React from 'react';
import ReactDOM from 'react-dom';
import './document.css';
import styles from './index.module.scss';
import { Grid } from './Grid/Grid';

export const App: React.FC = () => {
 
  return <div className={styles.app}>
    <Grid N={3}/>
  </div>
}

// Inject
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
