import { BrowserRouter } from 'react-router-dom';

import { Router } from './routes/routes';
import './styles/global.css';

export const App = () => {
  let socket = 'aushakjshkas';
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};
