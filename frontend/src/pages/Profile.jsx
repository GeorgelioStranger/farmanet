import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { toast } from 'sonner';
import { User, Save, Key } from 'lucide-react';

export default function Profile() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await api.put('/auth/profile', formData);
            if (data.id) {
                // Update context and local storage
                login(data, localStorage.getItem('token'));
                toast.success('Perfil actualizado correctamente');
            } else {
                toast.error(data.message || 'Error al actualizar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Configuración de Perfil</h1>
            
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Nombre del Doctor</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '12px', top: '18px', color: 'var(--text-muted)' }} size={18} />
                            <input 
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Correo Electrónico</label>
                        <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label>Nueva Contraseña (dejar en blanco para no cambiar)</label>
                        <div style={{ position: 'relative' }}>
                            <Key style={{ position: 'absolute', left: '12px', top: '18px', color: 'var(--text-muted)' }} size={18} />
                            <input 
                                type="password"
                                style={{ paddingLeft: '2.5rem' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <Save size={18} /> Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
}
