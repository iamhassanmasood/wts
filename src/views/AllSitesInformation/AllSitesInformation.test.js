import React from 'react';
import ReactDOM from 'react-dom';
import AllSitesInformation from './AllSitesInformation';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AllSitesInformation />, div);
    ReactDOM.unmountComponentAtNode(div);
});
