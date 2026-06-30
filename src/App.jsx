import React, { useState, useEffect, useRef } from 'react';
import { Upload, Plus, Archive, ChevronRight, Trash2, Download, MessageCircle, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const IRIDIO = () => {
  const [screen, setScreen] = useState('home');
  const [consultations, setConsultations] = useState([]);
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [analysisPhase, setAnalysisPhase] = useState('intake');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ status: 'ready', message: '' });

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const result = await window.storage?.list('consultation:');
      if (result?.keys) {
        const data = [];
        for (const key of result.keys) {
          const stored = await window.storage?.get(key);
          if (stored?.value) {
            data.push(JSON.parse(stored.value));
          }
        }
        setConsultations(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (err) {
      console.log('Storage non disponibile');
    }
  };

  const saveConsultation = async (data) => {
    try {
      const key = `consultation:${data.id}`;
      await window.storage?.set(key, JSON.stringify(data));
      await loadConsultations();
    } catch (err) {
      console.error('Errore:', err);
    }
  };

  const deleteConsultation = async (id) => {
    try {
      await window.storage?.delete(`consultation:${id}`);
      await loadConsultations();
    } catch (err) {
      console.error('Errore:', err);
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
    setApiStatus({ status: 'success', message: `✓` });
    return analysis;
  } catch (err) {  
    setApiStatus({ status: 'error', message: `Errore: ${err.message}` });
      setApiStatus({ status: 'error', message: `Errore: ${err.message}` });
      return null;
    }
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-block bg-teal-600 text-white rounded-full p-4 mb-4">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3" /></svg>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-2">IRIDIO</h1>
        <p className="text-xl text-slate-600">Intelligenza Artificiale per Iridologia Olistica Avanzata</p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button onClick={() => { setCurrentConsultation({ id: Date.now().toString(), date: new Date().toISOString().split('T')[0], client: { name: '', age: '', gender: '' }, photos: { left: null, right: null }, analysis: { left: null, right: null }, chatHistory: [], report: null }); setAnalysisPhase('intake'); setScreen('consultation'); }} className="group bg-gradient-to-br from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white p-8 rounded-xl shadow-lg transition-all duration-300 text-left">
          <div className="flex items-center mb-4"><Plus className="w-8 h-8 mr-3" /><h2 className="text-2xl font-bold">Nuova Consulenza</h2></div>
          <p className="text-teal-100">Avvia analisi AI iridologica</p>
        </button>

        <button onClick={() => setScreen('archive')} className="group bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white p-8 rounded-xl shadow-lg transition-all duration-300 text-left">
          <div className="flex items-center mb-4"><Archive className="w-8 h-8 mr-3" /><h2 className="text-2xl font-bold">Archivio</h2></div>
          <p className="text-amber-100">{consultations.length} consulenze salvate</p>
        </button>
      </div>
    </div>
  );

  const ConsultationScreen = () => (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => setScreen('home')} className="text-teal-600 hover:text-teal-700 font-semibold mb-6 flex items-center">← Torna</button>
        {analysisPhase === 'intake' && <IntakeForm />}
      </div>
    </div>
  );

  const IntakeForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Nuova Consulenza</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <input type="text" placeholder="Nome" value={currentConsultation.client.name} onChange={(e) => setCurrentConsultation({ ...currentConsultation, client: { ...currentConsultation.client, name: e.target.value } })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500" />
        <input type="number" placeholder="Età" value={currentConsultation.client.age} onChange={(e) => setCurrentConsultation({ ...currentConsultation, client: { ...currentConsultation.client, age: e.target.value } })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500" />
        <select value={currentConsultation.client.gender} onChange={(e) => setCurrentConsultation({ ...currentConsultation, client: { ...currentConsultation.client, gender: e.target.value } })} className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500">
          <option value="">Sesso</option><option value="F">Donna</option><option value="M">Uomo</option>
        </select>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Foto Iride</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PhotoUpload side="left" photo={currentConsultation.photos.left} onUpload={(data) => setCurrentConsultation({ ...currentConsultation, photos: { ...currentConsultation.photos, left: data } })} />
        <PhotoUpload side="right" photo={currentConsultation.photos.right} onUpload={(data) => setCurrentConsultation({ ...currentConsultation, photos: { ...currentConsultation.photos, right: data } })} />
      </div>
      <button onClick={() => { if (!currentConsultation.client.name || (!currentConsultation.photos.left && !currentConsultation.photos.right)) { alert('Nome e foto richiesti'); return; } setAnalysisPhase('analysis'); }} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg">✅ Procedi</button>
    </div>
  );

  const PhotoUpload = ({ side, photo, onUpload }) => {
    const inputRef = useRef(null);
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
        {photo ? (
          <div><img src={photo} alt="Occhio" className="w-full h-48 object-cover rounded-lg mb-4" /><button onClick={() => onUpload(null)} className="text-red-600 hover:text-red-700 font-semibold text-sm">Rimuovi</button></div>
        ) : (
          <div><Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" /><p className="text-slate-600 mb-2 text-sm">Occhio {side === 'left' ? 'Sinistro' : 'Destro'}</p><input ref={inputRef} type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (evt) => onUpload(evt.target.result); reader.readAsDataURL(file); } }} className="hidden" /><button onClick={() => inputRef.current?.click()} className="bg-teal-100 text-teal-700 hover:bg-teal-200 px-4 py-2 rounded-lg text-sm">Carica</button></div>
        )}
      </div>
    );
  };

  const ArchiveScreen = () => (
    <div className="bg-slate-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setScreen('home')} className="text-teal-600 font-semibold mb-6">← Torna</button>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white"><h2 className="text-3xl font-bold">Archivio</h2><p className="text-amber-100 mt-2">{consultations.length} consulenze</p></div>
          {consultations.length === 0 ? <div className="p-12 text-center text-slate-600"><p>Nessuna consulenza</p></div> : <div className="divide-y">{consultations.map((c) => <div key={c.id} className="p-6 hover:bg-slate-50 flex justify-between"><div><h3 className="font-bold text-slate-900">{c.client.name}</h3><p className="text-sm text-slate-600">Età: {c.client.age} | {c.date}</p></div><button onClick={() => { if (confirm(`Elimina ${c.client.name}?`)) deleteConsultation(c.id); }} className="bg-red-600 text-white px-4 py-2 rounded text-sm"><Trash2 className="w-4 h-4" /></button></div>)}</div>}
        </div>
      </div>
    </div>
  );

  return <div className="min-h-screen bg-slate-50">{screen === 'home' && <HomeScreen />}{screen === 'consultation' && <ConsultationScreen />}{screen === 'archive' && <ArchiveScreen />}</div>;
};

export default IRIDIO;
