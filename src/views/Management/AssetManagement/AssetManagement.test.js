import React from 'react';
import ReactDOM from 'react-dom';
import AssetManagement from './AssetManagement';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AssetManagement />, div);
  ReactDOM.unmountComponentAtNode(div);
});
