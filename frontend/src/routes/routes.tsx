import { Route, Routes, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Game } from '../pages/Game';
import { Players } from '../pages/Players';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/play" element={<Players />} />
      <Route path="*" element={<h1 className="text-white">Error 404</h1>} />
    </Routes>
  );
};
