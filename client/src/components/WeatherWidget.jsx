
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ICONS = {'Clear sky':'☀️','Mainly clear':'🌤️','Partly cloudy':'⛅','Overcast':'☁️','Fog':'🌫️','Depositing rime fog':'🌫️','Light drizzle':'🌦️','Drizzle':'🌦️','Dense drizzle':'🌧️','Slight rain':'🌦️','Rain':'🌧️','Heavy rain':'🌧️','Rain showers':'🌦️','Moderate showers':'🌧️','Violent showers':'⛈️','Thunderstorm':'⛈️','Slight snow':'🌨️','Mixed conditions':'🌥️'};

export default function WeatherWidget({defaultLocation='Ranipet',onData}) {
  const [location,setLocation]=useState(defaultLocation), [input,setInput]=useState(defaultLocation);
  const [data,setData]=useState(null), [loading,setLoading]=useState(true), [error,setError]=useState('');

  const fetchWeather=async loc=>{
    setLoading(true);setError('');
    try{const {data}=await api.get('/weather',{params:{location:loc}});setData(data);onData?.(data)}
    catch(err){setError(err.response?.data?.message||'Could not load live weather right now.');setData(null);onData?.(null)}
    finally{setLoading(false)}
  };
  useEffect(()=>{fetchWeather(location)},[location]);

  return <div className="panel weather-panel">
    <div className="weather-top">
      <div><div className="weather-label">Live conditions</div><h3 style={{fontSize:21}}>Weather advisory</h3></div>
      <div className="weather-icon">{data ? ICONS[data.current.label] || '🌥️' : '🌤️'}</div>
    </div>
    <form className="weather-search" onSubmit={e=>{e.preventDefault();setLocation(input)}} style={{marginTop:18}}>
      <input className="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="District"/>
      <button className="btn btn-ghost" type="submit">Check</button>
    </form>
    {loading&&<p className="dim" style={{marginTop:20}}>Fetching live conditions…</p>}
    {error&&!loading&&<p className="error" style={{marginTop:18}}>{error}</p>}
    {data&&!loading&&!error&&<>
      <div className="weather-row"><div><div className="weather-temp">{Math.round(data.current.temperature)}°</div><div className="weather-sub">{data.current.label} · {data.location}</div></div></div>
      <div className="advisory-line"><span className="mk">✓</span>{data.current.advisory}</div>
      {data.forecast?.slice(1,3).map(day=><div className="advisory-line" key={day.date}><span className="mk">→</span>{new Date(day.date).toLocaleDateString(undefined,{weekday:'long'})}: {day.advisory} ({day.rainChance}% rain)</div>)}
      <div className="dim" style={{fontSize:10,marginTop:12}}>Source: {data.source}</div>
    </>}
  </div>
}
