import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Clock, Plus, Save, Activity, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

export default function PatientDetail() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const pData = await api.get(`/patients/${id}`);
            const hData = await api.get(`/history/${id}`);
            setPatient(pData);
            setHistory(hData);
            setLoading(false);
        } catch (error) {
            toast.error('Error al cargar datos');
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await api.put(`/patients/${id}`, { status });
            setPatient({ ...patient, status });
            toast.success('Estado actualizado');
        } catch (error) {
            toast.error('Error al actualizar estado');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const data = await api.post('/history', { patientId: id, notes: newNote });
            setHistory([data, ...history]);
            setNewNote('');
            toast.success('Nota agregada al historial');
        } catch (error) {
            toast.error('Error al guardar nota');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando expediente...</div>;
    if (!patient) return <div style={{ padding: '2rem' }}>Paciente no encontrado</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 600 }}>
                <ArrowLeft size={18} /> Volver al Dashboard
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>{patient.name}</h1>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                        <span><strong>Área:</strong> {patient.area}</span>
                        <span>•</span>
                        <span><strong>Edad:</strong> {patient.age} años</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Estado Actual (Semáforo)</label>
                        <select 
                            value={patient.status} 
                            onChange={(e) => handleUpdateStatus(e.target.value)}
                            style={{ width: '200px', marginTop: 0 }}
                        >
                            <option value="stable">🟢 Estable (Verde)</option>
                            <option value="observation">🟡 En Observación (Amarillo)</option>
                            <option value="critical">🔴 Crítico (Rojo)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Information Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <Activity size={20} color="var(--primary)" /> Signos y Datos
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Altura</label>
                                <p style={{ fontWeight: 600 }}>{patient.height}</p>
                            </div>
                            <div>
                                <label>Peso</label>
                                <p style={{ fontWeight: 600 }}>{patient.weight}</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <label>Sintomatología Inicial</label>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{patient.symptoms}</p>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <ClipboardList size={20} color="var(--primary)" /> Antecedentes y Tratamiento
                        </h3>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Padecimientos Previos</label>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{patient.history || 'Ninguno registrado'}</p>
                        </div>
                        <div>
                            <label>Medicamentos Recetados</label>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{patient.medications || 'Ninguno registrado'}</p>
                        </div>
                    </div>
                </div>

                {/* History Column */}
                <div>
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Nueva Nota Médica</h3>
                        <form onSubmit={handleAddNote}>
                            <textarea 
                                required
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Escriba la evolución clínica o nuevas indicaciones..."
                                rows="4"
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={18} /> Agregar Nota
                                </button>
                            </div>
                        </form>
                    </div>

                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Clock size={20} /> Historial de Consultas
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.length > 0 ? history.map((entry) => (
                            <div key={entry._id} className="card" style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    {new Date(entry.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                                </div>
                                <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{entry.notes}</p>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#eee', borderRadius: 'var(--radius)' }}>
                                No hay notas previas en el historial.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
