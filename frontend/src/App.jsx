import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Configurar future flags para React Router v7
const routerConfig = {
  future: {
    v7_relativeSplatPath: true,
  },
};
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BatchPage from './pages/BatchPage';
import YouTubePage from './pages/YouTubePage';

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/batch" element={<BatchPage />} />
          <Route path="/youtube" element={<YouTubePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

