import React, { useState } from 'react';
import { X, Languages, Volume2, Search, Check, Sparkles } from 'lucide-react';

export const PhrasebookModal = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState('Japanese');
  const [activeCategory, setActiveCategory] = useState('Essentials');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);

  const phraseData = {
    Japanese: {
      langCode: 'ja-JP',
      phrases: [
        { id: 'j1', cat: 'Essentials', original: 'Konnichiwa', meaning: 'Hello / Good afternoon', kana: 'こんにちは' },
        { id: 'j2', cat: 'Essentials', original: 'Arigatou gozaimasu', meaning: 'Thank you very much', kana: 'ありがとうございます' },
        { id: 'j3', cat: 'Essentials', original: 'Sumimasen', meaning: 'Excuse me / Sorry', kana: 'すみません' },
        { id: 'j4', cat: 'Dining', original: 'Kore o kudasai', meaning: 'Please give me this', kana: 'これをください' },
        { id: 'j5', cat: 'Dining', original: 'Okaikei onegaishimasu', meaning: 'Bill / Check please', kana: 'お会計お願いします' },
        { id: 'j6', cat: 'Dining', original: 'Oishii desu!', meaning: 'This is delicious!', kana: '美味しいです！' },
        { id: 'j7', cat: 'Directions', original: 'Eki wa doko desu ka?', meaning: 'Where is the station?', kana: '駅はどこですか？' },
        { id: 'j8', cat: 'Directions', original: 'Eigo ga hanasemasu ka?', meaning: 'Do you speak English?', kana: '英語が話せますか？' },
        { id: 'j9', cat: 'Emergency', original: 'Tasukete kudasai!', meaning: 'Please help me!', kana: '助けてください！' },
      ],
    },
    Italian: {
      langCode: 'it-IT',
      phrases: [
        { id: 'i1', cat: 'Essentials', original: 'Buongiorno', meaning: 'Good morning / Hello', kana: 'Buongiorno' },
        { id: 'i2', cat: 'Essentials', original: 'Grazie mille', meaning: 'Thank you very much', kana: 'Grazie mille' },
        { id: 'i3', cat: 'Essentials', original: 'Per favore', meaning: 'Please', kana: 'Per favore' },
        { id: 'i4', cat: 'Dining', original: 'Il conto, per favore', meaning: 'The bill, please', kana: 'Il conto' },
        { id: 'i5', cat: 'Dining', original: 'Un tavolo per due', meaning: 'A table for two', kana: 'Tavolo per 2' },
        { id: 'i6', cat: 'Directions', original: 'Dov\'è la stazione?', meaning: 'Where is the station?', kana: 'Stazione?' },
      ],
    },
    Indonesian: {
      langCode: 'id-ID',
      phrases: [
        { id: 'id1', cat: 'Essentials', original: 'Terima kasih', meaning: 'Thank you', kana: 'Terima kasih' },
        { id: 'id2', cat: 'Essentials', original: 'Sama-sama', meaning: 'You are welcome', kana: 'Sama-sama' },
        { id: 'id3', cat: 'Dining', original: 'Minta bon, tolong', meaning: 'Check please', kana: 'Minta bon' },
        { id: 'id4', cat: 'Dining', original: 'Berapa harganya?', meaning: 'How much is this?', kana: 'Berapa harga?' },
      ],
    },
    French: {
      langCode: 'fr-FR',
      phrases: [
        { id: 'f1', cat: 'Essentials', original: 'Bonjour', meaning: 'Hello / Good day', kana: 'Bonjour' },
        { id: 'f2', cat: 'Essentials', original: 'Merci beaucoup', meaning: 'Thank you very much', kana: 'Merci' },
        { id: 'f3', cat: 'Dining', original: 'L\'addition, s\'il vous plaît', meaning: 'The check, please', kana: 'L\'addition' },
        { id: 'f4', cat: 'Directions', original: 'Où est le métro ?', meaning: 'Where is the metro?', kana: 'Métro ?' },
      ],
    },
  };

  const handleSpeak = (phrase) => {
    setPlayingId(phrase.id);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.original);
      utterance.lang = phraseData[selectedLang]?.langCode || 'en-US';
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 1000);
    }
  };

  if (!isOpen) return null;

  const currentLangObj = phraseData[selectedLang] || phraseData.Japanese;
  const filteredPhrases = currentLangObj.phrases.filter((p) => {
    const matchCat = activeCategory === 'All' || p.cat === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ background: 'var(--grad-sunset)' }}>
              <Languages size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>AI Traveler Phrasebook</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Instant local dialect phrases with voice audio pronunciation</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Language selector pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
            {Object.keys(phraseData).map((lang) => (
              <button
                key={lang}
                className={`category-pill ${selectedLang === lang ? 'active' : ''}`}
                onClick={() => setSelectedLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Search bar & Category filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
            <input
              type="text"
              className="input-field"
              placeholder={`Search in ${selectedLang}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          {/* Phrase List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{phrase.original}</span>
                    {phrase.kana && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)' }}>({phrase.kana})</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{phrase.meaning}</div>
                </div>

                <button
                  className="btn btn-icon"
                  style={{
                    background: playingId === phrase.id ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.08)',
                    color: playingId === phrase.id ? '#070b14' : '#fff',
                  }}
                  onClick={() => handleSpeak(phrase)}
                  title="Speak Phrase"
                >
                  <Volume2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
