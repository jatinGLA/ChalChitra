import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import './Home.css';



const Home = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToEvents = () => {
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(event => event.category.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(event.category.toLowerCase()));

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Experience the <span>Extraordinary</span></h1>
          <p className="hero-subtitle">Discover amazing live events, blockbuster movies, and sports action happening right near you.</p>
          <div className="hero-cta-group">
            <button className="primary-btn pulse-glow" onClick={() => { setActiveFilter('Movie'); handleScrollToEvents(); }}>Explore Movies</button>
            <button className="secondary-btn" onClick={() => { setActiveFilter('Concert'); handleScrollToEvents(); }}>View Live Events</button>
          </div>
        </div>
      </section>

      <section className="category-filters">
        <div className="filter-capsules">
          {['All', 'Movie', 'Concert', 'Comedy', 'Sports', 'Workshop'].map(filter => (
            <button 
              key={filter}
              className={`filter-capsule ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'Movie' ? 'Movies' : filter === 'Concert' ? 'Concerts' : filter === 'Comedy' ? 'Comedy Shows' : filter === 'Workshop' ? 'Workshops' : filter}
            </button>
          ))}
        </div>
      </section>

      <section className="events-grid-section" id="events-section">
        <div className="section-header">
          <h2>Trending Near You {activeFilter !== 'All' ? `- ${activeFilter}s` : ''}</h2>
          <button onClick={() => setActiveFilter('All')} className="view-all-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'var(--primary-color)'}}>View All &rarr;</button>
        </div>
        <div className="events-grid">
          {loading ? (
             <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '100px'}}>
               <div className="loading-spinner"></div>
               <p style={{marginTop: '20px', color: 'var(--text-muted)'}}>Curating the best events for you...</p>
             </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
             <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
               No events found in this category.
             </div>
          )}
        </div>
      </section>

      <section className="events-grid-section" style={{ marginTop: '50px' }}>
        <div className="section-header">
          <h2>Popular Theatres & Venues in <span style={{color: 'var(--primary-color)'}}>Your Zone</span></h2>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="view-all-link" style={{background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem', color: 'var(--primary-color)'}}>Back to Top &uarr;</button>
        </div>
        <div className="events-grid">
           {[
             {id: 1, name: 'PVR Director`s Cut', location: 'Vasant Kunj', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80', features: 'Dolby Atmos, Recliners'},
             {id: 2, name: 'INOX Megaplex', location: 'Nehru Place', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80', features: 'IMAX, 4DX'},
             {id: 3, name: 'Siri Fort Auditorium', location: 'Asian Games', img: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=500&q=80', features: 'Live Concerts, Plays'},
             {id: 4, name: 'JLN Stadium', location: 'Pragati Vihar', img: 'https://images.unsplash.com/photo-1540039155732-d6888424a7ba?w=500&q=80', features: 'Open Air, Mega Events'}
           ].map(venue => (
             <div key={venue.id} className="event-card" style={{paddingBottom: '20px', backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <img src={venue.img} alt={venue.name} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px 16px 0 0', marginBottom: '15px'}} />
                <div style={{padding: '0 20px'}}>
                  <h3 style={{fontSize: '1.2rem', marginBottom: '5px'}}>{venue.name}</h3>
                  <p style={{color: 'var(--text-muted)'}}>{venue.location}</p>
                  <p style={{color: '#f59e0b', fontWeight: 'bold', marginTop: '10px'}}>⭐ {venue.features}</p>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
