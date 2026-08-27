import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Fuel, HeartPulse, Hotel, Landmark, Loader2, MapPin, Navigation, Phone, Play, Shield, Star, Ticket, Utensils, WalletCards } from 'lucide-react';
import { api } from '../services/api';

const serviceTypes = [
  ['accommodation', 'Hotels & hostels', Hotel], ['food', 'Restaurants & cafes', Utensils], ['fuel', 'Fuel stations', Fuel],
  ['health', 'Hospitals & pharmacies', HeartPulse], ['safety', 'Police & fire', Shield], ['essentials', 'ATMs & banks', WalletCards],
  ['theatre', 'Theatres & cinema', Ticket], ['parks', 'Parks & leisure', Landmark],
];

const knownCoordinates = {
  Hyderabad: [17.385, 78.4867], Warangal: [17.9821, 79.5971], Goa: [15.4909, 73.8278], Jaipur: [26.9124, 75.7873],
  Mumbai: [19.076, 72.8777], Bengaluru: [12.9716, 77.5946], Chennai: [13.0827, 80.2707], Kochi: [9.9312, 76.2673],
  Varanasi: [25.3176, 82.9739], Agra: [27.1767, 78.0081], Manali: [32.2396, 77.1887], Darjeeling: [27.041, 88.2663],
};

export const PlaceGuide = () => {
  const { place } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state?.state || 'India';
  const [destination, setDestination] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [activeService, setActiveService] = useState('accommodation');
  const [serviceData, setServiceData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showAllNearby, setShowAllNearby] = useState(false);

  const placeName = decodeURIComponent(place);
  const mapsSearch = (query) => `https://www.google.com/maps/search/${encodeURIComponent(`${query}, ${placeName}, ${state}, India`)}`;
  const guide = useMemo(() => ({
    history: `${placeName} is a special part of ${state}, shaped by local history, living traditions, food, landscapes, and the people who call it home. Explore respectfully, keep time for local markets, and ask locally before visiting sensitive or seasonal sites.`,
    bestTime: 'October to March',
    tips: ['Start heritage visits early to avoid heat', 'Keep a little time for local food and markets', 'Check opening hours before travelling to remote sites'],
  }), [placeName, state]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const fallback = knownCoordinates[placeName];
        const geocodeRequest = fallback ? Promise.resolve([]) : fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${placeName}, ${state}, India`)}&format=jsonv2&limit=1`, { headers: { Accept: 'application/json' } }).then((response) => response.json());
        const results = await Promise.race([geocodeRequest, new Promise((resolve) => window.setTimeout(() => resolve([]), 3500))]);
        if (!results[0] && !fallback) throw new Error('This place could not be located.');
        const result = { name: placeName, displayName: results[0]?.display_name || `${placeName}, ${state}, India`, coordinates: results[0] ? [Number(results[0].lat), Number(results[0].lon)] : fallback };
        setDestination(result);
        setLoading(false);
        const [lat, lon] = result.coordinates;
        const withTimeout = (promise) => Promise.race([promise, new Promise((resolve) => window.setTimeout(() => resolve(null), 4000))]);
        const [tourismResult, mediaResult] = await Promise.allSettled([
          withTimeout(api.recommendations.getNearby(lat, lon, 'tourism')),
          withTimeout(fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(`${placeName} India`)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`).then((response) => response.json())),
        ]);
        if (tourismResult.status === 'fulfilled') setNearby(tourismResult.value.elements || []);
        if (mediaResult.status === 'fulfilled') setPhotos(Object.values(mediaResult.value.query?.pages || []).map((item) => item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url).filter(Boolean));
      } catch (err) { setError(err.message); } finally { setLoading(false); }
    };
    load();
  }, [placeName, state]);

  useEffect(() => {
    if (!destination) return undefined;
    const loadServices = async () => {
      setServiceLoading(true);
      try {
        const response = await api.recommendations.getNearby(destination.coordinates[0], destination.coordinates[1], activeService);
        setServiceData((previous) => ({ ...previous, [activeService]: response.elements || [] }));
      } catch (err) { setError(err.message); } finally { setServiceLoading(false); }
    };
    loadServices();
  }, [destination, activeService]);

  const useCurrentLocation = () => navigator.geolocation?.getCurrentPosition((position) => setCurrentLocation([position.coords.latitude, position.coords.longitude]), () => setError('Location permission was not granted.'));
  const directions = currentLocation && destination ? `https://www.google.com/maps/dir/?api=1&origin=${currentLocation[0]},${currentLocation[1]}&destination=${destination.coordinates[0]},${destination.coordinates[1]}&travelmode=driving` : mapsSearch('directions to');
  const items = serviceData[activeService] || [];
  const visibleNearby = showAllNearby ? nearby : nearby.slice(0, 8);

  if (loading) return <div className="place-guide-loading"><Loader2 className="spin" size={28} /> Loading the {placeName} guide...</div>;
  return <div className="place-guide-page"><main className="place-guide-content"><button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to recommendations</button><section className="guide-intro"><div><span className="eyebrow"><Landmark size={14} /> {state.toUpperCase()} PLACE GUIDE</span><h1>{placeName}</h1><p>{destination?.displayName}</p><div className="guide-actions"><button className="btn btn-primary" onClick={useCurrentLocation}><Navigation size={16} /> {currentLocation ? 'Location ready' : 'Use current location'}</button><a className="btn btn-secondary" href={directions} target="_blank" rel="noreferrer"><MapPin size={16} /> Get directions</a></div></div><div className="guide-coordinates"><MapPin size={17} /><strong>{destination?.coordinates[0].toFixed(5)}, {destination?.coordinates[1].toFixed(5)}</strong><small>Mapped destination coordinates</small></div></section>
<section className="guide-media"><div className="photo-carousel">{photos.length ? <><img src={photos[photoIndex]} alt={`${placeName} view ${photoIndex + 1}`} /><button className="carousel-button left" onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)}><ChevronLeft size={20} /></button><button className="carousel-button right" onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}><ChevronRight size={20} /></button><span>{photoIndex + 1} / {photos.length} photos</span></> : <div className="photo-empty">Photos are not available from Wikimedia for this place yet.</div>}</div><div className="video-panel"><span className="eyebrow"><Play size={14} /> OFFICIAL VIDEOS</span><h2>See {placeName} before you go</h2><p>Open current video results from official tourism boards, museums, and verified local channels.</p><a className="video-link" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${placeName} ${state} official tourism`)}`} target="_blank" rel="noreferrer"><Play size={16} /> Watch official videos on YouTube <ExternalLink size={14} /></a><a className="video-link secondary" href={mapsSearch('tourist attractions')} target="_blank" rel="noreferrer"><MapPin size={16} /> Browse all attractions on Google Maps <ExternalLink size={14} /></a></div></section>
<section className="history-panel"><div><span className="eyebrow">LOCAL HISTORY & INFORMATION</span><h2>Know the place</h2><p>{guide.history}</p></div><div className="guide-facts"><span><Star size={15} /> Best time: {guide.bestTime}</span>{guide.tips.map((tip) => <span key={tip}><Landmark size={15} /> {tip}</span>)}</div></section>
<section className="nearby-guide"><div className="section-heading"><div><span className="eyebrow">LIVE LOCAL DIRECTORY</span><h2>Nearby {serviceTypes.find(([key]) => key === activeService)?.[1]}</h2><p>Real map listings around {placeName}, including public contact details when available.</p></div><span className="result-count"><strong>{items.length}</strong> results</span></div><div className="service-tabs">{serviceTypes.map(([key, label, Icon]) => <button key={key} className={activeService === key ? 'active' : ''} onClick={() => setActiveService(key)}><Icon size={16} /> {label}</button>)}</div>{serviceLoading ? <div className="empty-state"><Loader2 className="spin" size={24} /> Finding live listings...</div> : <div className="service-layout"><div className="service-list">{items.map((item) => { const tags = item.tags || {}; return <article className="service-card" key={`${item.type}-${item.id}`}><div className="nearby-icon"><MapPin size={17} /></div><div><h3>{tags.name || tags['name:en'] || 'Unnamed listing'}</h3><p>{tags['addr:street'] || tags['addr:city'] || state}</p>{tags.phone && <a href={`tel:${tags.phone}`}><Phone size={13} /> {tags.phone}</a>}{tags.website && <a href={tags.website} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Website</a>}</div></article>; })}{!items.length && <div className="empty-state">No named listings returned for this category. Google Maps may have more current results.</div>}</div><div className="guide-map"><iframe title={`Map for ${placeName}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${destination.coordinates[1] - .12}%2C${destination.coordinates[0] - .12}%2C${destination.coordinates[1] + .12}%2C${destination.coordinates[0] + .12}&layer=mapnik&marker=${destination.coordinates[0]}%2C${destination.coordinates[1]}`} /><a href={mapsSearch(serviceTypes.find(([key]) => key === activeService)?.[1])} target="_blank" rel="noreferrer"><MapPin size={14} /> See many more on Google Maps</a></div></div>}</section>
<section className="recommend-more"><span className="eyebrow">KEEP EXPLORING</span><h2>More places near {placeName}</h2><p>Browse the live tourist places found around this destination without leaving Wayfare.</p><div className="more-place-grid">{visibleNearby.map((item) => <article className="service-card" key={`${item.type}-${item.id}`}><div className="nearby-icon"><Landmark size={17} /></div><div><h3>{item.tags?.name || item.tags?.['name:en'] || 'Nearby attraction'}</h3><p>{item.tags?.['addr:city'] || state}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.tags?.name || placeName}, ${state}, India`)}`} target="_blank" rel="noreferrer"><MapPin size={13} /> Open map</a></div></article>)}</div><div><button className="btn btn-primary" onClick={() => setShowAllNearby(true)} disabled={showAllNearby || nearby.length <= 8}><Landmark size={16} /> {showAllNearby ? 'All nearby places shown' : `Show ${nearby.length - 8 > 0 ? nearby.length - 8 : 'more'} more in app`}</button><a className="btn btn-secondary" href={mapsSearch('best hotels hostels')} target="_blank" rel="noreferrer"><Hotel size={16} /> Search stays on Google Maps</a></div></section></main></div>;
};
