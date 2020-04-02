import React from 'react';
import ReactDOM from 'react-dom';
import TagManagement from './TagManagement';
import { mount } from 'enzyme/build';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TagManagement />, div);
  ReactDOM.unmountComponentAtNode(div);
});
