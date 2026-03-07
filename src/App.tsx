import { useState, useEffect } from 'react'
import { useAuth } from './features/auth/AuthContext'
import Login from './features/auth/Login'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

interface Project {
 id: string
 name: string
 color: string
}

interface Column {
 id: string
 title: string
 tasks: string[]
}

export default function App() {

 const { state } = useAuth()

 if (!state.user) {
  return <Login />
 }

 return <Dashboard />

}

function Dashboard() {

 const { state, dispatch } = useAuth()

 const [sidebarOpen, setSidebarOpen] = useState(true)
 const [projects, setProjects] = useState<Project[]>([])
 const [columns, setColumns] = useState<Column[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {

  async function fetchData() {

   try {

    const [p, c] = await Promise.all([
     fetch('http://localhost:4000/projects'),
     fetch('http://localhost:4000/columns')
    ])

    setProjects(await p.json())
    setColumns(await c.json())

   } catch (e) {
    console.error(e)
   }

   finally {
    setLoading(false)
   }

  }

  fetchData()

 }, [])

 if (loading) return <div>Chargement...</div>

 return (

  <div style={{display:'flex', flexDirection:'column', height:'100vh'}}>

   <Header
    title="TaskFlow"
    onMenuClick={() => setSidebarOpen(p => !p)}
    userName={state.user?.name}
    onLogout={() => dispatch({ type: 'LOGOUT' })}
   />

   <div style={{display:'flex', flex:1}}>

    <Sidebar projects={projects} isOpen={sidebarOpen} />

    <MainContent columns={columns} />

   </div>

  </div>

 )

}