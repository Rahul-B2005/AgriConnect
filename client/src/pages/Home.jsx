
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import PriceTicker from '../components/PriceTicker';
import WeatherWidget from '../components/WeatherWidget';

const CropField3D = lazy(() => import('../components/CropField3D'));
const RAINY_LABELS = ['drizzle', 'rain', 'showers', 'thunderstorm'];

export default function Home() {
  const [allowMotion, setAllowMotion] = useState(true);
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAllowMotion(!mq.matches);
    const handler = e => setAllowMotion(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const windSpeedKmh = liveWeather?.current?.windSpeed ?? 8;
  const rainy = RAINY_LABELS.some(w => (liveWeather?.current?.label || '').toLowerCase().includes(w));

  return <>
    <PriceTicker />
    <header className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="hero-stamp">Ranipet district · registered farmers &amp; buyers</div>
          <h1>A ledger for the harvest, not a middleman.</h1>
          <p className="lede">List what you've grown, find who's buying, and settle the order — the same three steps a mandi runs on, moved online so both sides can see the same page.</p>
          <div className="hero-actions">
            <Link className="btn" to="/market">Browse the marketplace</Link>
            <Link className="btn btn-ghost" to="/register">List your harvest</Link>
          </div>
          <div className="hero-ledger">
            <div className="ledger-item"><strong>01</strong><span>List a crop</span></div>
            <div className="ledger-item"><strong>02</strong><span>Buyer orders</span></div>
            <div className="ledger-item"><strong>03</strong><span>Track delivery</span></div>
          </div>
        </div>
        <div style={{display:'grid',gap:16}}>
          <div className="field-panel">
            <span className="field-tag">Field view</span>
            {allowMotion && <Suspense fallback={null}><CropField3D windSpeedKmh={windSpeedKmh} rainy={rainy} /></Suspense>}
          </div>
          <WeatherWidget onData={setLiveWeather} />
        </div>
      </div>
    </header>

    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <h2>Everything you need to move a harvest from field to sale.</h2>
          <p>A clean digital flow designed for farmers and buyers — with less friction at every step.</p>
        </div>
        <div className="steps">
          <div className="step"><span className="step-num">01</span><h3>Publish your harvest</h3><p>Add crop, quantity, district, harvest date and price. Your listing is ready in minutes.</p></div>
          <div className="step"><span className="step-num">02</span><h3>Find the right produce</h3><p>Buyers search by crop or district, compare prices and choose fresh listings directly.</p></div>
          <div className="step"><span className="step-num">03</span><h3>Track every order</h3><p>Farmers update order status from confirmation to delivery while buyers stay informed.</p></div>
        </div>
      </div>
    </section>

    <section className="section" style={{paddingTop:0}}>
      <div className="wrap">
        <div className="panel" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:25,flexWrap:'wrap',background:'var(--olive-2)',color:'#e7e1c9',border:'0'}}>
          <div><h2 style={{fontSize:28,color:'#f4efd9'}}>Put your harvest in front of more buyers.</h2><p style={{margin:'8px 0 0',color:'#c3bb9c'}}>Create your free farmer or buyer account today.</p></div>
          <Link className="btn" style={{background:'var(--rust)',borderColor:'var(--rust)'}} to="/register">Create account</Link>
        </div>
      </div>
    </section>
    <footer className="footer"><div className="wrap">© {new Date().getFullYear()} AgriConnect · Connecting agriculture with opportunity.</div></footer>
  </>;
}
