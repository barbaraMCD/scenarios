import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import GraphPage from "@/screens/GraphPage.tsx";
import CreateScenarioPage from "@/screens/CreateScenarioPage.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
              <Route path="/scenario/create" element={<CreateScenarioPage />} />
            <Route path="/graphs" element={<GraphPage />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
