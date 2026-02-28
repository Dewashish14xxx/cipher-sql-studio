import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AttemptPage from './pages/AttemptPage';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './context/AuthContext';
import './styles/main.scss';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assignment/:id" element={<AttemptPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: 48, color: '#9094c0' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>404</h2>
              <p>Page not found.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
