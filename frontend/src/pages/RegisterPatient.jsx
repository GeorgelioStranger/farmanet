import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterPatient() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        symptoms: '',
        history: '',
        medications: '',
        area: 'Medicina Interna',
        status: 'stable',
        prescriptions: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await api.post('/patients', {
                ...formData,
                prescriptions: formData.prescriptions.filter(p => p.medication.trim() !== '')
            });
            if (data._id) {
                toast.success('Paciente registrado con éxito');
                navigate('/');
            } else {
                toast.error(data.message || 'Error al registrar');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        }
    };

    const handleAddPrescriptionField = () => {
        setFormData({
            ...formData,
            prescriptions: [...formData.prescriptions, { medication: '', quantity: '', frequency: '', duration: '' }]
        });
    };

    const handlePrescriptionChange = (index, field, value) => {
        const updated = [...formData.prescriptions];
        updated[index][field] = value;
        setFormData({ ...formData, prescriptions: updated });
    };

    const handleRemovePrescription = (index) => {
        setFormData({
            ...formData,
            prescriptions: formData.prescriptions.filter((_, i) => i !== index)
        });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 600 }}>
                <ArrowLeft size={18} /> Volver al Dashboard
            </Link>

            <h1 style={{ marginBottom: '2rem' }}>Registrar Nuevo Paciente</h1>

            <form onSubmit={handleSubmit} className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Nombre Completo</label>
                        <input name="name" required value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" />
                    </div>
                    
                    <div>
                        <label>Edad</label>
                        <input name="age" type="number" required value={formData.age} onChange={handleChange} placeholder="Ej. 45" />
                    </div>

                    <div>
                        <label>Área Médica</label>
                        <select name="area" value={formData.area} onChange={handleChange}>
                            <option>Medicina Interna</option>
                            <option>Cardiología</option>
                            <option>Pediatría</option>
                            <option>Neurología</option>
                            <option>Ginecología</option>
                            <option>Otro</option>
                        </select>
                    </div>

                    <div>
                        <label>Altura (cm)</label>
                        <input name="height" required value={formData.height} onChange={handleChange} placeholder="Ej. 175 cm" />
                    </div>

                    <div>
                        <label>Peso (kg)</label>
                        <input name="weight" required value={formData.weight} onChange={handleChange} placeholder="Ej. 80 kg" />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Estado del Paciente</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="stable">🟢 Estable (Verde)</option>
                            <option value="observation">🟡 En Observación (Amarillo)</option>
                            <option value="critical">🔴 Crítico (Rojo)</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Sintomatología (Texto Libre)</label>
                        <textarea name="symptoms" rows="3" required value={formData.symptoms} onChange={handleChange} placeholder="Describa los síntomas actuales..." />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label>Antecedentes Hospitalarios</label>
                        <textarea name="history" rows="2" value={formData.history} onChange={handleChange} placeholder="Padecimientos previos, cirugías..." />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ fontWeight: 700 }}>Receta Inicial (Medicamentos)</label>
                            <button type="button" onClick={handleAddPrescriptionField} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                <Plus size={14} /> Agregar Medicamento
                            </button>
                        </div>
                        
                        {formData.prescriptions.length > 0 ? formData.prescriptions.map((p, index) => (
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
                                            placeholder="Ej: 30 de abril" 
                                            value={p.duration} 
                                            onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                                            style={{ height: '35px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8f9fa', border: '1px dashed #ccc', borderRadius: '8px', color: 'var(--text-muted)' }}>
                                No se han agregado medicamentos iniciales.
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> Guardar Paciente
                    </button>
                </div>
            </form>
        </div>
    );
}
