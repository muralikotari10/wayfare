import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ExternalLink, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const indiaStates = {
  'Andhra Pradesh': ['Tirupati', 'Visakhapatnam', 'Araku Valley', 'Vijayawada', 'Gandikota', 'Amaravati', 'Srisailam', 'Lambasingi'],
  Assam: ['Guwahati', 'Kaziranga National Park', 'Majuli', 'Sivasagar', 'Manas National Park'],
  Bihar: ['Bodh Gaya', 'Nalanda', 'Rajgir', 'Patna', 'Vaishali'],
  Chhattisgarh: ['Chitrakote Falls', 'Bastar', 'Raipur', 'Sirpur'],
  Goa: ['Panaji', 'Baga Beach', 'Palolem Beach', 'Dudhsagar Falls', 'Old Goa', 'Anjuna'],
  Gujarat: ['Ahmedabad', 'Rann of Kutch', 'Dwarka', 'Somnath', 'Gir National Park', 'Statue of Unity'],
  Haryana: ['Kurukshetra', 'Sultanpur National Park', 'Pinjore', 'Gurugram'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Spiti Valley', 'Kasol', 'Dalhousie'],
  Jharkhand: ['Ranchi', 'Deoghar', 'Netarhat', 'Betla National Park', 'Hundru Falls'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hampi', 'Coorg', 'Gokarna', 'Chikmagalur', 'Badami'],
  Kerala: ['Munnar', 'Alappuzha', 'Kochi', 'Varkala', 'Wayanad', 'Thekkady', 'Kovalam'],
  'Madhya Pradesh': ['Bhopal', 'Khajuraho', 'Ujjain', 'Orchha', 'Pachmarhi', 'Kanha National Park'],
  Maharashtra: ['Mumbai', 'Pune', 'Lonavala', 'Mahabaleshwar', 'Ajanta Caves', 'Ellora Caves', 'Alibaug'],
  Manipur: ['Imphal', 'Loktak Lake', 'Ukhrul', 'Moirang'],
  Meghalaya: ['Shillong', 'Cherrapunji', 'Dawki', 'Mawlynnong', 'Nongriat'],
  Mizoram: ['Aizawl', 'Lunglei', 'Reiek', 'Vantawng Falls'],
  Nagaland: ['Kohima', 'Dzukou Valley', 'Mokokchung', 'Mon'],
  Odisha: ['Bhubaneswar', 'Puri', 'Konark', 'Chilika Lake', 'Cuttack', 'Simlipal'],
  Punjab: ['Amritsar', 'Patiala', 'Anandpur Sahib', 'Wagah Border'],
  Rajasthan: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Ranthambore', 'Mount Abu'],
  Sikkim: ['Gangtok', 'Pelling', 'Lachung', 'Nathula Pass', 'Yuksom'],
  'Tamil Nadu': ['Chennai', 'Ooty', 'Madurai', 'Kodaikanal', 'Rameswaram', 'Kanyakumari', 'Mahabalipuram'],
  Telangana: ['Hyderabad', 'Warangal', 'Nagarjuna Sagar', 'Ramoji Film City', 'Bhongir Fort', 'Ananthagiri Hills', 'Medak', 'Bhadrachalam', 'Ramappa Temple', 'Thousand Pillar Temple'],
  Tripura: ['Agartala', 'Unakoti', 'Neermahal', 'Jampui Hills'],
  'Uttar Pradesh': ['Agra', 'Varanasi', 'Lucknow', 'Ayodhya', 'Mathura', 'Sarnath', 'Prayagraj'],
  Uttarakhand: ['Rishikesh', 'Nainital', 'Mussoorie', 'Kedarnath', 'Badrinath', 'Jim Corbett National Park'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Sundarbans', 'Kalimpong', 'Digha', 'Shantiniketan'],
};

const neighboringStates = {
  Telangana: ['Andhra Pradesh', 'Maharashtra', 'Chhattisgarh', 'Karnataka'],
  Maharashtra: ['Gujarat', 'Madhya Pradesh', 'Chhattisgarh', 'Karnataka', 'Goa'],
  Karnataka: ['Goa', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Tamil Nadu'],
  Kerala: ['Karnataka', 'Tamil Nadu'],
  'Tamil Nadu': ['Kerala', 'Karnataka', 'Andhra Pradesh'],
  Goa: ['Maharashtra', 'Karnataka'],
  'Andhra Pradesh': ['Telangana', 'Odisha', 'Tamil Nadu', 'Karnataka'],
};

export const Explore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({ style: 'All', group: 'Solo' });
  const [state, setState] = useState('');
  const [search, setSearch] = useState('');
  const [safeTripMessage, setSafeTripMessage] = useState('');
  const places = useMemo(() => (indiaStates[state] || []).filter((place) => place.toLowerCase().includes(search.toLowerCase())), [state, search]);
  const nearbyPlaces = (neighboringStates[state] || []).flatMap((neighbor) => (indiaStates[neighbor] || []).slice(0, 4).map((place) => ({ place, state: neighbor })));
  const updateState = (event) => { setState(event.target.value); setSearch(''); };
  const openGuide = (place, placeState) => navigate(`/place/${encodeURIComponent(place)}`, { state: { state: placeState } });
  const firstName = user?.name?.split(' ')[0] || 'traveller';

  return <div className="recommendation-page">
    <section className="recommendation-hero"><div className="recommendation-hero-inner"><span className="eyebrow"><Compass size={15} /> INDIA TRAVEL GUIDE</span><h1>Hey {firstName}, find your Indian escape.</h1><p>Tell us how you like to travel, choose the state you belong to, and discover nearby places worth visiting.</p><div className="safe-trip-banner"><span>Ready when you are, {firstName}.</span><button onClick={() => setSafeTripMessage('Have a safe and wonderful trip!')}>Have a safe trip</button>{safeTripMessage && <strong>{safeTripMessage}</strong>}</div><div className="selection-panel onboarding-panel"><div className="selection-step"><span>01</span><label>Travel style<select className="input-field" value={preferences.style} onChange={(event) => setPreferences({ ...preferences, style: event.target.value })}><option>All</option><option>Heritage</option><option>Nature</option><option>Food</option><option>Adventure</option><option>Family</option></select></label></div><div className="selection-step"><span>02</span><label>Travelling<select className="input-field" value={preferences.group} onChange={(event) => setPreferences({ ...preferences, group: event.target.value })}><option>Solo</option><option>With family</option><option>With friends</option><option>As a couple</option></select></label></div><div className="selection-step"><span>03</span><label>State you belong to<select className="input-field" value={state} onChange={updateState}><option value="">Select your Indian state</option>{Object.keys(indiaStates).sort().map((item) => <option key={item}>{item}</option>)}</select></label></div></div></div></section>
    <main className="recommendation-content">{state ? <><section className="place-section"><div className="section-heading"><div><span className="eyebrow">{state} · {indiaStates[state].length} destinations</span><h2>Places in {state}</h2><p>Choose a place to open its full guide with photos, videos, directions, and local services.</p></div><div className="live-status"><span className="live-dot" /> Home state</div></div><div className="place-tools"><input className="input-field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search places in your state..." /></div><div className="place-grid">{places.map((place) => <button key={place} className="place-choice" onClick={() => openGuide(place, state)}><MapPin size={16} /><span>{place}</span><ExternalLink size={14} /></button>)}</div></section>{nearbyPlaces.length > 0 && <section className="place-section neighbor-section"><div className="section-heading"><div><span className="eyebrow">SHORT TRIPS NEARBY</span><h2>Neighboring states</h2><p>More Indian destinations close to {state}.</p></div></div><div className="place-grid">{nearbyPlaces.map(({ place, state: placeState }) => <button key={`${placeState}-${place}`} className="place-choice" onClick={() => openGuide(place, placeState)}><MapPin size={16} /><span><strong>{place}</strong><small>{placeState}</small></span><ExternalLink size={14} /></button>)}</div></section>}</> : <section className="empty-guide"><Compass size={36} /><h2>Start with your state</h2><p>Choose your travel style and state above to see destinations in your home state and nearby Indian states.</p></section>}</main>
  </div>;
};
