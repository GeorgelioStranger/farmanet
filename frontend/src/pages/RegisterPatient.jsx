import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
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
        status: 'stable'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await api.post('/patients', formData);
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

                    <div>
                        <label>Antecedentes Hospitalarios</label>
                        <textarea name="history" rows="3" value={formData.history} onChange={handleChange} placeholder="Padecimientos previos, cirugías..." />
                    </div>

                    <div>
                        <label>Medicamentos Recetados</label>
                        <textarea name="medications" rows="3" value={formData.medications} onChange={handleChange} placeholder="Lista de medicamentos actuales..." />
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
