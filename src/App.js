import React, { useState, useEffect } from 'react';

const MAJOR_SCALES = {
  'Do': ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI'],
  'Sol': ['SOL', 'LA', 'SI', 'DO', 'RE', 'MI', 'FA#'],
  'Re': ['RE', 'MI', 'FA#', 'SOL', 'LA', 'SI', 'DO#'],
  'La': ['LA', 'SI', 'DO#', 'RE', 'MI', 'FA#', 'SOL#'],
  'Mi': ['MI', 'FA#', 'SOL#', 'LA', 'SI', 'DO#', 'RE#'],
  'Si': ['SI', 'DO#', 'RE#', 'MI', 'FA#', 'SOL#', 'LA#'],
  'Fa#': ['FA#', 'SOL#', 'LA#', 'SI', 'DO#', 'RE#', 'MI#'],
  'Reb': ['REb', 'MIb', 'FA', 'SOLb', 'LAb', 'SIb', 'DO'],
  'Lab': ['LAb', 'SIb', 'DO', 'REb', 'MIb', 'FA', 'SOL'],
  'Mib': ['MIb', 'FA', 'SOL', 'LAb', 'SIb', 'DO', 'RE'],
  'Sib': ['SIb', 'DO', 'RE', 'MIb', 'FA', 'SOL', 'LA'],
  'Fa': ['FA', 'SOL', 'LA', 'SIb', 'DO', 'RE', 'MI']
};

export default function App() {
  const tonalitaKeys = Object.keys(MAJOR_SCALES);
  const [tonalita, setTonalita] = useState('Do');
  const [grado, setGrado] = useState(null);
  const [input, setInput] = useState('');
  const [corrette, setCorrette] = useState(0);
  const [totali, setTotali] = useState(0);
  const [mostraScala, setMostraScala] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [inCorso, setInCorso] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [tempoRisposta, setTempoRisposta] = useState(0);
  const [mediaTempo, setMediaTempo] = useState(0);

  const nuovaDomanda = () => {
    const nuovoGrado = Math.floor(Math.random() * 7) + 1;
    setGrado(nuovoGrado);
    setInput('');
    setFeedback('');
    setStartTime(Date.now());
  };

  const controllaRisposta = () => {
    if (!grado || !inCorso) return;
    const tempoImpiegato = (Date.now() - startTime) / 1000;
    setTempoRisposta(tempoImpiegato.toFixed(2));

    setTotali((prevTotali) => {
      const nuoviTotali = prevTotali + 1;
      setMediaTempo(((mediaTempo * prevTotali + tempoImpiegato) / nuoviTotali).toFixed(2));
      return nuoviTotali;
    });

    const notaCorretta = MAJOR_SCALES[tonalita][grado - 1];
    const risposta = input.trim().toUpperCase();
    if (risposta === notaCorretta) {
      setCorrette((prev) => prev + 1);
      setFeedback(`✅ Corretto! (${notaCorretta})`);
    } else {
      setFeedback(`❌ Sbagliato. Era ${notaCorretta}`);
    }
    setTimeout(() => {
      if (inCorso) nuovaDomanda();
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && inCorso) {
        controllaRisposta();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, grado, tonalita, inCorso, startTime]);

  const toggleStartStop = () => {
    if (inCorso) {
      setInCorso(false);
      setGrado(null);
      setFeedback('');
      setTempoRisposta(0);
      setMediaTempo(0);
    } else {
      setCorrette(0);
      setTotali(0);
      setMediaTempo(0);
      setTempoRisposta(0);
      setInCorso(true);
      nuovaDomanda();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 p-6">
      <h1 className="text-3xl font-bold mb-4">🎵 Allenamento Scale Maggiori</h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Tonalità:</label>
        <select
          value={tonalita}
          onChange={(e) => setTonalita(e.target.value)}
          className="p-2 border rounded"
          disabled={inCorso}
        >
          {tonalitaKeys.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="text-xl mb-2">Punteggio: {corrette} / {totali}</div>
      {inCorso && (
        <div className="text-lg mb-2">
          ⏱️ Tempo risposta: {tempoRisposta}s | ⏳ Media: {mediaTempo}s
        </div>
      )}

      {grado && inCorso && <div className="text-6xl font-bold mb-4">{grado}</div>}

      {inCorso && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi la nota e premi Invio..."
          className="p-2 rounded border text-center text-lg mb-4"
        />
      )}

      {feedback && <div className="mt-2 text-lg">{feedback}</div>}

      <button
        onClick={toggleStartStop}
        className={`mt-4 px-6 py-2 rounded text-white ${inCorso ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {inCorso ? 'Stop' : 'Start'}
      </button>

      <button
        onClick={() => setMostraScala(!mostraScala)}
        className="mt-6 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
      >
        {mostraScala ? 'Nascondi scala' : 'Mostra scala'}
      </button>

      {mostraScala && (
        <div className="mt-4 p-4 bg-white rounded shadow text-center">
          <h2 className="font-semibold mb-2">Scala di {tonalita} maggiore</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {MAJOR_SCALES[tonalita].map((nota, i) => (
              <div key={i} className="p-2 bg-blue-200 rounded">
                {i + 1}: {nota}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}