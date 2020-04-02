import React from 'react';
import ReactDOM from 'react-dom';
import RegionManagement from './RegionManagement';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<RegionManagement />, div);
    ReactDOM.unmountComponentAtNode(div);
});
