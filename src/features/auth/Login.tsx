import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../../store'
import { loginStart, loginSuccess, loginFailure } from './authSlice'
import { useNavigate } from 'react-router-dom'

export default function Login() {

 const dispatch = useDispatch()
 const { loading, error } = useSelector((state: RootState) => state.auth)
 const navigate = useNavigate()

 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')

 async function handleSubmit(e: React.FormEvent) {

  e.preventDefault()

  dispatch(loginStart())

  try {

   const res = await fetch(`http://localhost:4000/users?email=${email}`)
   const users = await res.json()

   if (users.length === 0 || users[0].password !== password) {

    dispatch(loginFailure('Email ou mot de passe incorrect'))

    return
   }

   const { password: _, ...user } = users[0] // eslint-disable-line @typescript-eslint/no-unused-vars

   const fakeToken = btoa(JSON.stringify({
    userId: user.id,
    email: user.email,
    role: 'admin',
    exp: Date.now() + 3600000 // expire dans 1h
   }));

   dispatch(loginSuccess({ user, token: fakeToken }))

   // redirection vers dashboard
   navigate('/dashboard')

  } catch {

   dispatch(loginFailure('Erreur serveur'))

  }

 }

 return (

  <div style={{padding:'40px'}}>

   <h1>TaskFlow Login</h1>

   {error && <p style={{color:'red'}}>{error}</p>}

   <form onSubmit={handleSubmit}>

    <input
     type="email"
     placeholder="Email"
     value={email}
     onChange={e => setEmail(e.target.value)}
    />

    <br/><br/>

    <input
     type="password"
     placeholder="Password"
     value={password}
     onChange={e => setPassword(e.target.value)}
    />

    <br/><br/>

    <button type="submit">
     {loading ? "Connexion..." : "Se connecter"}
    </button>

   </form>

  </div>

 )
}