import React from 'react';
import ReactDOM from 'react-dom';
import DeviceManagement from './DeviceManagement';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DeviceManagement />, div);
  ReactDOM.unmountComponentAtNode(div);
});
