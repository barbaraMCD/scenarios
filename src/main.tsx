import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import GraphPage from "@/screens/GraphPage.tsx";
import CreateEditScenarioPage from "@/screens/CreateEditScenarioPage.tsx";
import SimulationPage from "@/screens/SimulationPage.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
              <Route path="/scenario/create" element={<CreateEditScenarioPage />} />
              <Route path="/scenario/edit/:id" element={<CreateEditScenarioPage />} />
            <Route path="/graphs" element={<GraphPage />} />
              <Route path="/simulation/:id" element={<SimulationPage />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
