import React, { useState } from 'react';
import { Upload, Plus, Archive, Trash2, ArrowLeft } from 'lucide-react';

export default function IRIDIO() {
  const [screen, setScreen] = useState('home');
  const [nome, setNome] = useState('');
  const [eta, setEta] = useState('');
  const [sesso, setSesso] = useState('');
  const [photoSx, setPhotoSx] = useState(null);
  const [photoDx, setPhotoDx] = useState(null);
  const [consultazioni, setConsultazioni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handlePhotoUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (side === 'sx') setPhotoSx(event.target.result);
        else setPhotoDx(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

const analyzeWithAI = async (photoBase64, side) => {
  try {
    const base64Data = photoBase64.split(',')[1];
    
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photoBase64: base64Data,
        photoSide: side
      })
    });

    if (!response.ok) {
      throw new Error(`Errore: ${response.status}`);
    }

    const data = await response.json();
    return data.analysis || data.error || 'Errore analisi';
  } catch (err) {
    return `Errore nell'analisi: ${err.message}`;
  }
};
      sesso,
      photoSx,
      photoDx,
      analysisSx,
      analysisDx,
      data: new Date().toLocaleDateString('it-IT'),
      timestamp: new Date().toLocaleTimeString('it-IT')
    };

    setConsultazioni([...consultazioni, newConsultazione]);
    setAnalysisResult(newConsultazione);
    setLoading(false);
  };

  const deleteConsultazione = (id) => {
    setConsultazioni(consultazioni.filter(c => c.id !== id));
  };

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '0.5rem' }}>👁️</div>
          <h1 style={{ fontSize: '32px', fontWeight: 500, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>IRIDIO</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Intelligenza Artificiale per Iridologia Olistica Avanzata</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              setScreen('consultation');
              setAnalysisResult(null);
              setNome('');
              setEta('');
              setSesso('');
              setPhotoSx(null);
              setPhotoDx(null);
            }}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} /> Nuova Consultazione
          </button>

          <button
            onClick={() => setScreen('archive')}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--surface-1)',
              color: 'var(--text-primary)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Archive size={20} /> Archivio ({consultazioni.length})
          </button>
        </div>
      </div>
    );
  }

  // CONSULTATION SCREEN
  if (screen === 'consultation') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-accent)',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Torna
        </button>

        {analysisResult ? (
          <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '12px', padding: '1.5rem', border: '0.5px solid var(--border)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Analisi completata ✓
            </h2>

            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{analysisResult.nome} • {analysisResult.eta} anni • {analysisResult.sesso === 'F' ? 'Donna' : 'Uomo'}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{analysisResult.data} - {analysisResult.timestamp}</p>
            </div>

            {analysisResult.photoSx && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>👁️ Foto Occhio Sinistro</h3>
                <img src={analysisResult.photoSx} alt="Occhio sinistro" style={{ width: '100%', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', marginBottom: '1rem', maxHeight: '200px', objectFit: 'cover' }} />
              </div>
            )}

            {analysisResult.analysisSx && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>📊 Analisi Occhio Sinistro</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', backgroundColor: 'var(--surface-2)', padding: '1rem', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {analysisResult.analysisSx}
                </div>
              </div>
            )}

            {analysisResult.photoDx && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>👁️ Foto Occhio Destro</h3>
                <img src={analysisResult.photoDx} alt="Occhio destro" style={{ width: '100%', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', marginBottom: '1rem', maxHeight: '200px', objectFit: 'cover' }} />
              </div>
            )}

            {analysisResult.analysisDx && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>📊 Analisi Occhio Destro</h3>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', backgroundColor: 'var(--surface-2)', padding: '1rem', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {analysisResult.analysisDx}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setAnalysisResult(null);
                setNome('');
                setEta('');
                setSesso('');
                setPhotoSx(null);
                setPhotoDx(null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--fill-accent)',
                color: 'var(--on-accent)',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Nuova Consultazione
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--surface-1)', borderRadius: '12px', padding: '1.5rem', border: '0.5px solid var(--border)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Nuova Consultazione</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome cliente"
                style={{ width: '100%', padding: '0.75rem', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Età</label>
              <input
                type="number"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                placeholder="Età"
                style={{ width: '100%', padding: '0.75rem', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Sesso</label>
              <select
                value={sesso}
                onChange={(e) => setSesso(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '0.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">Seleziona</option>
                <option value="F">Femmina</option>
                <option value="M">Maschio</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Foto Iride Sinistra</label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '2px dashed var(--border-accent)', borderRadius: 'var(--radius)', padding: '1.5rem', cursor: 'pointer', backgroundColor: 'var(--surface-2)' }}>
                <Upload size={20} style={{ color: 'var(--text-accent)', marginRight: '0.5rem' }} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'sx')}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Carica foto</span>
              </label>
              {photoSx && (
                <div style={{ marginTop: '1rem' }}>
                  <img src={photoSx} alt="Anteprima sinistro" style={{ width: '100%', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', maxHeight: '150px', objectFit: 'cover' }} />
                  <p style={{ fontSize: '12px', color: 'var(--text-success)', margin: '0.5rem 0 0 0' }}>✓ Foto caricata</p>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Foto Iride Destra</label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', cursor: 'pointer', backgroundColor: 'var(--surface-2)' }}>
                <Upload size={20} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'dx')}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Carica foto</span>
              </label>
              {photoDx && (
                <div style={{ marginTop: '1rem' }}>
                  <img src={photoDx} alt="Anteprima destro" style={{ width: '100%', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', maxHeight: '150px', objectFit: 'cover' }} />
                  <p style={{ fontSize: '12px', color: 'var(--text-success)', margin: '0.5rem 0 0 0' }}>✓ Foto caricata</p>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalysis}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading ? 'var(--fill-disabled)' : 'var(--fill-accent)',
                color: loading ? 'var(--text-disabled)' : 'var(--on-accent)',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Analisi in corso...' : 'Analizza'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ARCHIVE SCREEN
  if (screen === 'archive') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <button
          onClick={() => setScreen('home')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-accent)',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Torna
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Archivio Consultazioni</h2>

        {consultazioni.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Nessuna consultazione salvata</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {consultazioni.map((c) => (
              <div key={c.id} style={{ backgroundColor: 'var(--surface-1)', borderRadius: '12px', padding: '1rem', border: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{c.nome}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0' }}>{c.eta} anni • {c.sesso === 'F' ? 'Donna' : 'Uomo'}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>{c.data}</p>
                </div>
                <button
                  onClick={() => deleteConsultazione(c.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-danger)',
                    cursor: 'pointer',
                    padding: '0',
                    marginLeft: '1rem'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
   
