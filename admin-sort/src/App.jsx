import React from 'react';



import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  // require admin session flag set by main admin UI
  useEffect(() => {
    try {
      const isAdmin = sessionStorage.getItem('isAdmin');
      if (!isAdmin) {
        setError('Zugriff verweigert. Bitte Admin-Bereich öffnen und einloggen.');
      }
    } catch(e) {}
  }, []);
  const [produkte, setProdukte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchProdukte() {
      setLoading(true);
      const { data, error } = await supabase
        .from('produkte')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) setError(error.message);
      else setProdukte(data);
      setLoading(false);
    }
    fetchProdukte();
  }, []);

  // Handler für Drag & Drop
  function handleDragEnd(result) {
    if (!result.destination) return;
    // defensive checks
    const src = result.source?.index;
    const dest = result.destination?.index;
    if (typeof src !== 'number' || typeof dest !== 'number') return;
    const items = Array.from(produkte);
    // ensure indexes in range
    if (src < 0 || src >= items.length || dest < 0 || dest > items.length) return;
    const [removed] = items.splice(src, 1);
    items.splice(dest, 0, removed);
    setProdukte(items);
  }

  function handleDragStart(start) {
    console.log('drag start', start);
  }

  function handleDragUpdate(update) {
    console.log('drag update', update);
  }

  async function saveOrder() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      // prepare updates: set sort_order = index+1
      const updates = produkte.map((p, idx) => ({ id: p.id, sort_order: idx + 1 }));
      // perform updates in parallel
      const results = await Promise.all(
        updates.map((u) =>
          supabase.from('produkte').update({ sort_order: u.sort_order }).eq('id', u.id)
        )
      );
      // check for errors
      const firstError = results.find((r) => r.error);
      if (firstError) {
        setError(firstError.error.message || 'Fehler beim Speichern');
      } else {
        setMessage('Reihenfolge erfolgreich gespeichert.');
        // optional: reload from DB to sync
        const { data, error: reError } = await supabase.from('produkte').select('*').order('sort_order', { ascending: true });
        if (reError) setError(reError.message);
        else setProdukte(data);
      }
    } catch (err) {
      setError(err.message || 'Unbekannter Fehler');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Produkte sortieren (Admin-Test)</h1>
      {loading && <p>Lade Produkte...</p>}
      {error && <p style={{color:'red'}}>Fehler: {error}</p>}
      {!loading && !error && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="produkte">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{padding:0, listStyle:'none'}}
              >
                {produkte
                  .filter((p) => p && p.id !== undefined && p.id !== null)
                  .map((p, index) => (
                    <Draggable key={`prod-${p.id}`} draggableId={`prod-${p.id}`} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: snapshot.isDragging ? '#e0e7ff' : 'white',
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            marginBottom: 8,
                            padding: '8px 12px',
                            ...provided.draggableProps.style
                          }}
                        >
                          <span
                            {...provided.dragHandleProps}
                            style={{
                              cursor: 'grab',
                              fontSize: 20,
                              marginRight: 12,
                              userSelect: 'none',
                              color: '#888',
                              lineHeight: 1
                            }}
                            title="Ziehen zum Sortieren"
                          >
                            ≡
                          </span>
                          <span style={{flex:1}}>{p.produkt} <span style={{color:'#888'}}>({p.sort_order ?? '-'})</span></span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <p style={{fontSize:'0.9em',color:'#888'}}>Die Reihenfolge wird aktuell nur lokal geändert.</p>
      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:12}}>
        <button
          onClick={saveOrder}
          disabled={saving}
          style={{padding:'8px 12px',borderRadius:6,border:'1px solid #0b5fff',background:saving? '#e6f0ff':'#0b5fff',color:'white',cursor: saving? 'not-allowed':'pointer'}}
        >
          {saving ? 'Speichern...' : 'Speichern'}
        </button>
        {message && <div style={{color:'green'}}>{message}</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
      </div>
    </div>
  );
}

export default App;
