import React from 'react';
import ReactDOM from 'react-dom';
import MapModule from './MapModule';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<MapModule />, div);
    ReactDOM.unmountComponentAtNode(div);
});
