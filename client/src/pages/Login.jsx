
import React,{useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Login(){
 const {login}=useAuth();const navigate=useNavigate();const [form,setForm]=useState({email:'',password:''});const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 const submit=async e=>{e.preventDefault();setError('');setLoading(true);try{await login(form.email,form.password);navigate('/')}catch(err){setError(err.response?.data?.message||'Login failed')}finally{setLoading(false)}};
 return <main className="auth-shell"><div className="panel auth-card">
  <div className="auth-brand"><span className="logo-mark">AC</span> AgriConnect</div>
  <h1 className="form-title">Sign in to your account</h1><p className="form-subtitle">Continue managing harvests, orders and opportunities.</p>
  <form onSubmit={submit} style={{display:'grid',gap:15}}>
   <div><label className="form-label">Email address</label><input className="input" type="email" placeholder="you@example.com" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
   <div><label className="form-label">Password</label><input className="input" type="password" placeholder="Your password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
   {error&&<div className="error">{error}</div>}<button className="btn" disabled={loading}>{loading?'Signing in…':'Sign in'}</button>
  </form>
  <p className="dim" style={{fontSize:13,marginTop:20}}>New to AgriConnect? <Link to="/register" style={{color:'var(--rust)',fontWeight:700}}>Create an account</Link></p>
 </div></main>
}
