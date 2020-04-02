import React from 'react';
import ReactDOM from 'react-dom';
import SiteConfiguration from './SiteConfiguration';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SiteConfiguration />, div);
    ReactDOM.unmountComponentAtNode(div);
});
