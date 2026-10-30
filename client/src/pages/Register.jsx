
import React,{useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Register(){
 const {register}=useAuth();const navigate=useNavigate();const [form,setForm]=useState({name:'',email:'',password:'',role:'farmer',district:''});const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 const submit=async e=>{e.preventDefault();setError('');setLoading(true);try{await register(form);navigate('/')}catch(err){setError(err.response?.data?.message||'Registration failed')}finally{setLoading(false)}};
 return <main className="auth-shell"><div className="panel auth-card">
  <div className="auth-brand"><span className="logo-mark">AC</span> AgriConnect</div>
  <h1 className="form-title">Create your account</h1><p className="form-subtitle">Choose your role and start connecting directly with agriculture buyers or farmers.</p>
  <form onSubmit={submit} style={{display:'grid',gap:14}}>
   <div><label className="form-label">Full name</label><input className="input" placeholder="Your name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
   <div><label className="form-label">Email address</label><input className="input" type="email" placeholder="you@example.com" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
   <div><label className="form-label">Password</label><input className="input" type="password" minLength={6} placeholder="At least 6 characters" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
   <div><label className="form-label">District</label><input className="input" placeholder="e.g. Ranipet" required value={form.district} onChange={e=>setForm({...form,district:e.target.value})}/></div>
   <div><label className="form-label">I am joining as</label><div className="role-switch">{['farmer','buyer'].map(r=><button type="button" key={r} className={`role-option ${form.role===r?'active':''}`} onClick={()=>setForm({...form,role:r})}>{r==='farmer'?'🌾':'🛒'} {r[0].toUpperCase()+r.slice(1)}</button>)}</div></div>
   {error&&<div className="error">{error}</div>}<button className="btn" disabled={loading}>{loading?'Creating account…':'Create account'}</button>
  </form>
  <p className="dim" style={{fontSize:13,marginTop:20}}>Already registered? <Link to="/login" style={{color:'var(--rust)',fontWeight:700}}>Sign in</Link></p>
 </div></main>
}
