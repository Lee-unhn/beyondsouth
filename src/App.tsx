/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Beyond South 2026 - Main Application Entry
 * Updated: 2026-04-13
 * Version: 1.0.1
 */

import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Background from './pages/Background';
import Register from './pages/Register';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/background" element={<Background />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
