import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import { AppShell } from '@/components/layout/AppShell';
import HomePage from '@/pages/HomePage';
import WorkPage from '@/pages/WorkPage';
import CaseStudyPage from '@/pages/CaseStudyPage';
import ExperiencePage from '@/pages/ExperiencePage';
import CapabilitiesPage from '@/pages/CapabilitiesPage';
import InsightsPage from '@/pages/InsightsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ExecutiveBriefPage from '@/pages/ExecutiveBriefPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/capabilities" element={<CapabilitiesPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/insights/:slug" element={<InsightsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/executive-brief" element={<ExecutiveBriefPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
