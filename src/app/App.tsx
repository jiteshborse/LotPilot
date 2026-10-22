import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../pages/HomePage';
import { CalculatorPage } from '../pages/CalculatorPage';
import { MarketsPage } from '../pages/MarketsPage';
import { MethodologyPage } from '../pages/MethodologyPage';
import { FAQPage } from '../pages/FAQPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/markets" element={<MarketsPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
