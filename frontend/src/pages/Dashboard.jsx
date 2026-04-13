import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Plus, Archive, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await api.get('/patients');
            if (Array.isArray(data)) setPatients(data);
            setLoading(false);
        } catch (error) {
            toast.error('Error al cargar pacientes');
            setLoading(false);
        }
    };

    const handleArchive = async (id) => {
        if (!confirm('¿Deseas archivar este paciente?')) return;
        try {
            await api.delete(`/patients/${id}`);
            toast.success('Paciente archivado');
            loadPatients();
        } catch (error) {
            toast.error('Error al archivar');
        }
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status) => {
        const labels = { stable: 'Estable', observation: 'Observación', critical: 'Crítico' };
        return <span className={`badge badge-${status}`}>{labels[status]}</span>;
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Panel de Pacientes</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestiona y monitorea a tus pacientes registrados.</p>
                </div>
                <Link to="/register-patient" className="btn btn-primary">
                    <Plus size={20} /> Registrar Paciente
                </Link>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '18px', color: 'var(--text-muted)' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre..." 
                        style={{ paddingLeft: '2.5rem', marginTop: 0 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ width: '200px' }}>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginTop: 0 }}>
                        <option value="all">Todos los estados</option>
                        <option value="stable">Verde: Estable</option>
                        <option value="observation">Amarillo: Observación</option>
                        <option value="critical">Rojo: Crítico</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Cargando pacientes...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredPatients.map(patient => (
                        <div key={patient._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ background: '#e7f1ff', padding: '10px', borderRadius: '50%', color: 'var(--primary)' }}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{patient.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{patient.area}</p>
                                    </div>
                                </div>
                                {getStatusBadge(patient.status)}
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                                <div><strong>Edad:</strong> {patient.age} años</div>
                                <div><strong>Peso:</strong> {patient.weight}</div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleArchive(patient._id)} className="btn" style={{ padding: '0.4rem', color: 'var(--danger)', background: 'transparent' }} title="Archivar">
                                        <Archive size={18} />
                                    </button>
                                </div>
                                <Link to={`/patient/${patient._id}`} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                                    Ver Detalle <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {!loading && filteredPatients.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No se encontraron pacientes registrados.
                </div>
            )}
        </div>
    );
}
