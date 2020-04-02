import React from 'react';
import ReactDOM from 'react-dom';
import Management from './Management';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Management />, div);
    ReactDOM.unmountComponentAtNode(div);
});
