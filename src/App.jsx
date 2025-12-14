import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewHomePage from './components/NewHomePage';
import UnifiedCityPage from './components/UnifiedCityPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [tempUnit, setTempUnit] = useState('C');

  return (
    <BrowserRouter>
      {/* Tự động scroll lên đầu khi đổi route */}
      <ScrollToTop />

      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={<NewHomePage tempUnit={tempUnit} />}
        />

        {/* Trang chi tiết thành phố */}
        <Route
          path="/city/:cityName"
          element={<UnifiedCityPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
