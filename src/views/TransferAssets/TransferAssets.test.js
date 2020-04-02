import React from 'react';
import ReactDOM from 'react-dom';
import TransferAssets from './TransferAssets';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TransferAssets />, div);
  ReactDOM.unmountComponentAtNode(div);
});
