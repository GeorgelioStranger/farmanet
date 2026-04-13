import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import { LogOut, User, LayoutDashboard, PlusCircle, Settings } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterPatient from './pages/RegisterPatient';
import PatientDetail from './pages/PatientDetail';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
    const { user, logout } = useAuth();
    if (!user) return null;

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Farmanet</h2>
                </Link>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>
                        <LayoutDashboard size={18} /> Panel
                    </Link>
                    <Link to="/register-patient" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>
                        <PlusCircle size={18} /> Registro
                    </Link>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <User size={18} />
                    <span>Dr. {user.name}</span>
                </Link>
                <button onClick={logout} className="btn" style={{ color: 'var(--danger)', background: '#fff1f2' }}>
                    <LogOut size={18} /> Salir
                </button>
            </div>
        </nav>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/register-patient" element={
                            <PrivateRoute>
                                <RegisterPatient />
                            </PrivateRoute>
                        } />
                        <Route path="/patient/:id" element={
                            <PrivateRoute>
                                <PatientDetail />
                            </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </Router>
            <Toaster position="top-right" richColors />
        </AuthProvider>
    );
}

export default App;
