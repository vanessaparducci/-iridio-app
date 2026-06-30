import React, { useState, useEffect } from 'react';
import { Upload, Plus, Archive, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [nome, setNome] = useState('');
  const [eta, setEta] = useState('');
  const [sesso, setSesso] = useState('');
  const [photoSx, setPhotoSx] = useState(null);
  const [photoDx, setPhotoDx] = useState(null);
  const [consultazioni, setConsultazioni] = useState([]);
  const [apiStatus, setApiStatus] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    loadConsultazioni();
  }, []);

  const loadConsultazioni = async () => {
    try {
      const result = await window.storage.get('consultazioni');
      if (result) {
        setConsultazioni(JSON.parse(result.value));
      }
    } catch (err) {
      console.log('Nessuna consultazione salvata');
    }
  };

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

  const analyzeIridisPhoto = async (photoBase64, photoSide) => {
    try {
      setApiStatus({ status: 'analyzing', message: `Analizzando occhio ${photoSide === 'left' ? 'sinistro' : 'destro'}...` });
      
      if (!photoBase64 || !photoBase64.includes('base64')) {
        throw new Error('Foto non valida');
      }

      const response = await fetch('/.netlify/functions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoBase64, photoSide })
      });

      if (!response.ok) throw new Error(`Errore: ${response.status}`);
      const analysis = await response.json();

      setApiStatus({ status: 'success', message: `✓` });
      return analysis;
    } catch (err) {
      setApiStatus({ status: 'error', message: `Errore: ${err.message}` });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!nome || !eta || !sesso || (!photoSx && !photoDx)) {
      alert('Completa tutti i campi e carica almeno una foto!');
      return;
    }

    setApiStatus({ status: 'analyzing', message: 'Analisi in corso...' });

    let analysisSx = null;
    let analysisDx = null;

    if (photoSx) {
      analysisSx = await analyzeIridisPhoto(photoSx, 'left');
    }

    if (photoDx) {
      analysisDx = await analyzeIridisPhoto(photoDx, 'right');
    }

    const newConsultazione = {
      id: Date.now(),
      nome,
      eta,
      sesso,
      photoSx,
      photoDx,
      analysisSx,
      analysisDx,
      data: new Date().toLocaleDateString('it-IT')
    };

    const updated = [...consultazioni, newConsultazione];
    setConsultazioni(updated);
    await window.storage.set('consultazioni', JSON.stringify(updated));

    setNome('');
    setEta('');
    setSesso('');
    setPhotoSx(null);
    setPhotoDx(null);
    setApiStatus({ status: 'success', message: 'Consultazione salvata!' });
    
    setTimeout(() => {
      setScreen('home');
      setApiStatus({ status: 'idle', message: '' });
    }, 2000);
  };

  const deleteConsultazione = async (id) => {
    const updated = consultazioni.filter(c => c.id !== id);
    setConsultazioni(updated);
    await window.storage.set('consultazioni', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-amber-50 p-4">
      {screen === 'home' && (
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-slate-900 mb-2">IRIDIO</h1>
            <p className="text-xl text-slate-600">Intelligenza Artificiale per Iridologia Olistica Avanzata</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setScreen('consultation')}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus size={24} /> Nuova Consultazione
            </button>

            <button
              onClick={() => setScreen('archive')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <Archive size={24} /> Archivio ({consultazioni.length})
            </button>
          </div>
        </div>
      )}

      {screen === 'consultation' && (
        <div className="max-w-md mx-auto pt-4">
          <button
            onClick={() => setScreen('home')}
            className="mb-4 flex items-center gap-2 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft size={20} /> Torna
          </button>

          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Nuova Consultazione</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                placeholder="Nome"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Età</label>
              <input
                type="number"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                placeholder="Età"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sesso</label>
              <select
                value={sesso}
                onChange={(e) => setSesso(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2"
              >
                <option value="">Seleziona</option>
                <option value="F">Femmina</option>
                <option value="M">Maschio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Foto Iride Sinistra</label>
              <label className="flex items-center justify-center w-full border-2 border-dashed border-teal-300 rounded-lg p-4 cursor-pointer hover:bg-teal-50">
                <Upload size={24} className="text-teal-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'sx')}
                  className="hidden"
                />
              </label>
              {photoSx && <p className="text-sm text-green-600 mt-2">✓ Foto caricata</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Foto Iride Destra</label>
              <label className="flex items-center justify-center w-full border-2 border-dashed border-amber-300 rounded-lg p-4 cursor-pointer hover:bg-amber-50">
                <Upload size={24} className="text-amber-500" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 'dx')}
                  className="hidden"
                />
              </label>
              {photoDx && <p className="text-sm text-green-600 mt-2">✓ Foto caricata</p>}
            </div>

            {apiStatus.status !== 'idle' && (
              <div className={`p-4 rounded-lg text-center ${
                apiStatus.status === 'success' ? 'bg-green-100 text-green-700' :
                apiStatus.status === 'error' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {apiStatus.message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={apiStatus.status === 'analyzing'}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
              {apiStatus.status === 'analyzing' ? 'Analisi in corso...' : 'Analizza'}
            </button>
          </div>
        </div>
      )}

      {screen === 'archive' && (
        <div className="max-w-md mx-auto pt-4">
          <button
            onClick={() => setScreen('home')}
            className="mb-4 flex items-center gap-2 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft size={20} /> Torna
          </button>

          <h2 className="text-2xl font-bold text-slate-900 mb-4">Archivio Consultazioni</h2>

          {consultazioni.length === 0 ? (
            <p className="text-slate-600">Nessuna consultazione salvata</p>
          ) : (
            <div className="space-y-4">
              {consultazioni.map((c) => (
                <div key={c.id} className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{c.nome}</h3>
                      <p className="text-sm text-slate-600">{c.eta} anni - {c.sesso === 'F' ? 'Donna' : 'Uomo'}</p>
                      <p className="text-xs text-slate-500">{c.data}</p>
                    </div>
                    <button
                      onClick={() => deleteConsultazione(c.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
