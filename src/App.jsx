import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewHomePage from './components/NewHomePage';
import UnifiedCityPage from './components/UnifiedCityPage';

// Main App Component
function App() {
  const [tempUnit, setTempUnit] = useState('C');

  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page - Giao diện mới */}
        <Route path="/" element={<NewHomePage tempUnit={tempUnit} />} />
        
        {/* Unified City Page - Tất cả info trong 1 trang */}
        <Route path="/city/:cityName" element={<UnifiedCityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;