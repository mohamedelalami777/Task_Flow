import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {

 const { state, dispatch } = useAuth()
 const navigate = useNavigate()

 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')

 async function handleSubmit(e: React.FormEvent) {

  e.preventDefault()

  dispatch({ type: 'LOGIN_START' })

  try {

   const res = await fetch(`http://localhost:4000/users?email=${email}`)
   const users = await res.json()

   if (users.length === 0 || users[0].password !== password) {

    dispatch({
     type: 'LOGIN_FAILURE',
     payload: 'Email ou mot de passe incorrect'
    })

    return
   }

   const { password: _, ...user } = users[0]

   dispatch({
    type: 'LOGIN_SUCCESS',
    payload: user
   })

   // redirection vers dashboard
   navigate('/dashboard')

  } catch {

   dispatch({
    type: 'LOGIN_FAILURE',
    payload: 'Erreur serveur'
   })

  }

 }

 return (

  <div style={{padding:'40px'}}>

   <h1>TaskFlow Login</h1>

   {state.error && <p style={{color:'red'}}>{state.error}</p>}

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
     {state.loading ? "Connexion..." : "Se connecter"}
    </button>

   </form>

  </div>

 )
}