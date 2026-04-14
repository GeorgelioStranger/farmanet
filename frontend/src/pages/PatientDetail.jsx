import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, Clock, Plus, Save, Activity, ClipboardList, Trash2, User as UserIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function PatientDetail() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [condition, setCondition] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
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
            const data = await api.post('/history', { 
                patientId: id, 
                notes: newNote,
                condition: condition,
                prescriptions: prescriptions.filter(p => p.medication.trim() !== '')
            });
            setHistory([data, ...history]);
            setNewNote('');
            setCondition('');
            setPrescriptions([]);
            toast.success('Nota agregada al historial');
        } catch (error) {
            toast.error('Error al guardar nota');
        }
    };

    const handleAddPrescriptionField = () => {
        setPrescriptions([...prescriptions, { medication: '', quantity: '', frequency: '', duration: '' }]);
    };

    const handlePrescriptionChange = (index, field, value) => {
        const updated = [...prescriptions];
        updated[index][field] = value;
        setPrescriptions(updated);
    };

    const handleRemovePrescription = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const allHistoricalPrescriptions = history.reduce((acc, entry) => {
        if (entry.prescriptions && entry.prescriptions.length > 0) {
            return [...acc, ...entry.prescriptions.map(p => ({ ...p, date: entry.date }))];
        }
        return acc;
    }, []);

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
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Medicamentos Base</label>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{patient.medications || 'Ninguno registrado'}</p>
                        </div>
                        
                        {allHistoricalPrescriptions.length > 0 && (
                            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <label style={{ color: 'var(--primary)', fontWeight: 700, display: 'block', marginBottom: '0.8rem' }}>Cronología de Recetas</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {allHistoricalPrescriptions.map((p, idx) => (
                                        <div key={idx} style={{ padding: '0.8rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.85rem' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{p.medication}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <Calendar size={12} /> {new Date(p.date).toLocaleDateString()}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                <div><strong>Cant:</strong> {p.quantity}</div>
                                                <div><strong>Freq:</strong> {p.frequency}</div>
                                                <div style={{ gridColumn: 'span 2' }}><strong>Hasta:</strong> {p.duration}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Column */}
                <div>
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Nueva Nota Médica</h3>
                        <form onSubmit={handleAddNote}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Padecimiento / Diagnóstico</label>
                                <input 
                                    type="text"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    placeholder="Ej: Gripe común, Hipertensión..."
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Evolución Clínica / Notas</label>
                                <textarea 
                                    required
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Escriba la evolución clínica o nuevas indicaciones..."
                                    rows="4"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: 700 }}>Recetar Medicamentos</label>
                                    <button type="button" onClick={handleAddPrescriptionField} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                        <Plus size={14} /> Agregar Medicamento
                                    </button>
                                </div>
                                
                                {prescriptions.map((p, index) => (
                                    <div key={index} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative', border: '1px solid #eee' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemovePrescription(index)}
                                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem' }}>Medicamento</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Nombre" 
                                                    value={p.medication} 
                                                    onChange={(e) => handlePrescriptionChange(index, 'medication', e.target.value)}
                                                    style={{ height: '35px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem' }}>Cantidad</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Ej: 500mg" 
                                                    value={p.quantity} 
                                                    onChange={(e) => handlePrescriptionChange(index, 'quantity', e.target.value)}
                                                    style={{ height: '35px' }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                            <div>
                                                <label style={{ fontSize: '0.75rem' }}>Cada cuánto</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Ej: 8 horas" 
                                                    value={p.frequency} 
                                                    onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)}
                                                    style={{ height: '35px' }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '0.75rem' }}>Hasta cuándo</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Ej: 5 días" 
                                                    value={p.duration} 
                                                    onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                                                    style={{ height: '35px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> Guardar Consulta
                                </button>
                            </div>
                        </form>
                    </div>

                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Clock size={20} /> Historial de Consultas
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {history.length > 0 ? history.map((entry) => (
                            <div key={entry._id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} />
                                        {new Date(entry.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <UserIcon size={14} />
                                        Dr. {entry.doctor?.name || 'Sistema'}
                                    </div>
                                </div>

                                {entry.condition && (
                                    <div style={{ marginBottom: '1rem', padding: '0.8rem', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #cce5ff' }}>
                                        <strong style={{ display: 'block', fontSize: '0.75rem', color: '#004085', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Padecimiento</strong>
                                        <div style={{ fontWeight: 700, color: '#004085' }}>{entry.condition}</div>
                                    </div>
                                )}

                                <div style={{ marginBottom: '1rem' }}>
                                    <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Notas Clínicas</strong>
                                    <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{entry.notes}</p>
                                </div>

                                {entry.prescriptions && entry.prescriptions.length > 0 && (
                                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #eee' }}>
                                        <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Medicamentos Recetados</strong>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {entry.prescriptions.map((p, idx) => (
                                                <div key={idx} style={{ fontSize: '0.85rem', padding: '0.8rem', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #eee' }}>
                                                    <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{p.medication}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        {p.quantity} • Cada {p.frequency} • {p.duration}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
