import React from 'react';
import ReactDOM from 'react-dom';
import './document.css';
import styles from './index.module.scss';
import classNames from 'classnames';

export const App: React.FC = () => {
  const cn = classNames();
  return <div className={cn}>

  </div>
}

// Inject
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
