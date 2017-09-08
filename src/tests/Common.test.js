import React from 'react';
import ReactDOM from 'react-dom';
import Common from '../pages/Common';
import './dev.env';

it('Common renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Common />, div);
});
