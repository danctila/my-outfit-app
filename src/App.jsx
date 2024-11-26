import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import PreferenceSetupPage from './pages/PreferenceSetupPage';
import GeneratorPage from './pages/GeneratorPage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user/preferences" element={<PreferenceSetupPage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
