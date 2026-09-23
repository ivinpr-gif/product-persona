import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PersonaProvider } from './context/PersonaContext';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import GeneratePersona from './pages/GeneratePersona';
import Personas from './pages/Personas';
import ProductValidation from './pages/ProductValidation';
import PersonaInterview from './pages/PersonaInterview';
import SurveyMode from './pages/SurveyMode';
import BehaviouralInsights from './pages/BehaviouralInsights';
import ScenarioQualityLab from './pages/ScenarioQualityLab';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <PersonaProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<GeneratePersona />} />
            <Route path="/personas" element={<Personas />} />
            <Route path="/validation" element={<ProductValidation />} />
            <Route path="/interview" element={<PersonaInterview />} />
            <Route path="/survey" element={<SurveyMode />} />
            <Route path="/insights" element={<BehaviouralInsights />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quality-lab" element={<ScenarioQualityLab />} />
          </Routes>
        </AppLayout>
      </PersonaProvider>
    </BrowserRouter>
  );
}


