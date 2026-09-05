import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import { CmsProvider, useCms } from '@/lib/cms-store';
import { AppShell } from '@/components/layout/AppShell';

// Public Pages
import HomePage from '@/pages/HomePage';
import WorkPage from '@/pages/WorkPage';
import CaseStudyPage from '@/pages/CaseStudyPage';
import ExperiencePage from '@/pages/ExperiencePage';
import CapabilitiesPage from '@/pages/CapabilitiesPage';
import PhilosophyPage from '@/pages/PhilosophyPage';
import EcosystemPage from '@/pages/EcosystemPage';
import InsightsPage from '@/pages/InsightsPage';
import { InsightDetailPage } from '@/pages/InsightDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ExecutiveBriefPage from '@/pages/ExecutiveBriefPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin CMS Pages
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminSlidersPage } from '@/pages/admin/AdminSlidersPage';
import { AdminCaseStudiesPage } from '@/pages/admin/AdminCaseStudiesPage';
import { AdminExperiencePage } from '@/pages/admin/AdminExperiencePage';
import { AdminCapabilitiesPage } from '@/pages/admin/AdminCapabilitiesPage';
import { AdminInsightsPage } from '@/pages/admin/AdminInsightsPage';
import { AdminSystemsPage } from '@/pages/admin/AdminSystemsPage';
import { AdminMetricsPage } from '@/pages/admin/AdminMetricsPage';
import { AdminEcosystemPage } from '@/pages/admin/AdminEcosystemPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminAuditBackupPage } from '@/pages/admin/AdminAuditBackupPage';
import { AdminWebmailPage } from '@/pages/admin/AdminWebmailPage';
import { AdminAdsPage } from '@/pages/admin/AdminAdsPage';
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage';

import { trackPageView } from '@/lib/analytics';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    trackPageView(pathname + hash);

    if (hash) {
      const targetId = hash.replace('#', '');
      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      // Slight timeout to ensure target element is mounted in DOM
      const timer = setTimeout(scrollToTarget, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useCms();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <CmsProvider>
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            {/* Public Login Routes */}
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin CMS Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="sliders" element={<AdminSlidersPage />} />
              <Route path="case-studies" element={<AdminCaseStudiesPage />} />
              <Route path="experience" element={<AdminExperiencePage />} />
              <Route path="capabilities" element={<AdminCapabilitiesPage />} />
              <Route path="insights" element={<AdminInsightsPage />} />
              <Route path="systems" element={<AdminSystemsPage />} />
              <Route path="metrics" element={<AdminMetricsPage />} />
              <Route path="ecosystem" element={<AdminEcosystemPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="webmail" element={<AdminWebmailPage />} />
              <Route path="ads" element={<AdminAdsPage />} />
              <Route path="audit" element={<AdminAuditBackupPage />} />
            </Route>

            {/* Public Portfolio Routes */}
            <Route
              path="/*"
              element={
                <AppShell>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/work" element={<WorkPage />} />
                    <Route path="/work/:slug" element={<CaseStudyPage />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/capabilities" element={<CapabilitiesPage />} />
                    <Route path="/philosophy" element={<PhilosophyPage />} />
                    <Route path="/ecosystem" element={<EcosystemPage />} />
                    <Route path="/blog" element={<InsightsPage />} />
                    <Route path="/blog/:slug" element={<InsightDetailPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/insights/:slug" element={<InsightDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/executive-brief" element={<ExecutiveBriefPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AppShell>
              }
            />
          </Routes>
        </BrowserRouter>
      </CmsProvider>
    </ThemeProvider>
  );
}

export default App;
