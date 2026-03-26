import React from 'react';
import EventCard from '../components/EventCard';
import './Home.css';

const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Arijit Singh Live',
    category: 'Concert',
    venue: 'JLN Stadium, Delhi',
    date: '25th Nov 2026',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1540039155732-d6888424a7ba?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Zakir Khan - Tathastu',
    category: 'Comedy',
    venue: 'Indira Gandhi Arena',
    date: '10th Dec 2026',
    price: 999,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Kalki 2898 AD',
    category: 'Movie',
    venue: 'PVR Director\'s Cut',
    date: 'Releasing Today',
    price: 450,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'IPL Final 2026',
    category: 'Sports',
    venue: 'Narendra Modi Stadium',
    date: '28th May 2026',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32fc3e659?auto=format&fit=crop&q=80&w=800'
  }
];

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Experience the <span>Extraordinary</span></h1>
          <p className="hero-subtitle">Discover amazing live events, blockbuster movies, and sports action happening right near you.</p>
          <div className="hero-cta-group">
            <button className="primary-btn pulse-glow">Explore Movies</button>
            <button className="secondary-btn">View Live Events</button>
          </div>
        </div>
      </section>

      <section className="category-filters">
        <div className="filter-capsules">
          <button className="filter-capsule active">All</button>
          <button className="filter-capsule">Movies</button>
          <button className="filter-capsule">Concerts</button>
          <button className="filter-capsule">Comedy Shows</button>
          <button className="filter-capsule">Sports</button>
          <button className="filter-capsule">Workshops</button>
        </div>
      </section>

      <section className="events-grid-section">
        <div className="section-header">
          <h2>Trending Near You</h2>
          <a href="#" className="view-all-link">View All &rarr;</a>
        </div>
        <div className="events-grid">
          {FEATURED_EVENTS.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="events-grid-section" style={{ marginTop: '50px' }}>
        <div className="section-header">
          <h2>Popular Theatres & Venues in <span style={{color: 'var(--primary-color)'}}>Your Zone</span></h2>
          <a href="#" className="view-all-link">View All Venues &rarr;</a>
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
