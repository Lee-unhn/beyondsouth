/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Background from './pages/Background';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/background" element={<Background />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
