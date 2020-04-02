import React from 'react';
import ReactDOM from 'react-dom';
import SiteManagement from './SiteManagement';
import { mount } from 'enzyme/build';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SiteManagement />, div);
  ReactDOM.unmountComponentAtNode(div);
})
