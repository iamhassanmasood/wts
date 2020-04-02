import React from 'react';
import ReactDOM from 'react-dom';
import GeneralReports from './GeneralReports';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<GeneralReports />, div);
  ReactDOM.unmountComponentAtNode(div);
});
