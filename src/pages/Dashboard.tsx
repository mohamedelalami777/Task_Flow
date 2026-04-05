import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { logout } from '../features/auth/authSlice'
import { memo } from 'react'
import api from '../api/axios'

import HeaderMUI from '../components/HeaderMUI'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'
import ProjectForm from '../components/ProjectForm'

import styles from './Dashboard.module.css'

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

export default function Dashboard() {

 const dispatch = useDispatch()
 const { user } = useSelector((state: RootState) => state.auth)

 const [sidebarOpen, setSidebarOpen] = useState(true)
 const [projects, setProjects] = useState<Project[]>([])
 const [columns, setColumns] = useState<Column[]>([])
 const [loading, setLoading] = useState(true)

 const [showForm, setShowForm] = useState(false)

 // GET DATA
 useEffect(() => {

  async function fetchData() {

   try {

    const [projRes, colRes] = await Promise.all([
     api.get('/projects'),
     api.get('/columns')
    ])

    setProjects(projRes.data)
    setColumns(colRes.data)

   } catch (e) {

    console.error(e)

   } finally {

    setLoading(false)

   }

  }

  fetchData()

 }, [])

 // POST PROJECT
 async function addProject(name: string, color: string) {

  const { data } = await api.post('/projects', { name, color })

  setProjects(prev => [...prev, data])

 }

 // PUT RENAME PROJECT
 const renameProject = useCallback(async (project: Project) => {

  const { data } = await api.put(`/projects/${project.id}`, project)

  setProjects(prev =>
   prev.map(p => (p.id === project.id ? data : p))
  )

 }, [])

 const handleRename = useCallback((project: Project) => {
  renameProject(project);
 }, []); // référence stable

 // DELETE PROJECT
 const deleteProject = useCallback(async (id: string) => {

  if (!window.confirm("Supprimer ce projet ?")) return

  await api.delete(`/projects/${id}`)

  setProjects(prev => prev.filter(p => p.id !== id))

 }, [])

 const MemoizedSidebar = memo(Sidebar);

 if (loading) {

  return <div className={styles.loading}>Chargement...</div>

 }

 const dangerousName = '<img src=x onerror=alert("HACK")>';

 return (

  <div className={styles.layout}>

   <HeaderMUI
    title="TaskFlow"
    onMenuClick={() => setSidebarOpen(p => !p)}
    userName={user?.name}
    onLogout={() => dispatch(logout())}
   />

   <div dangerouslySetInnerHTML={{ __html: dangerousName }} />

   <div className={styles.body}>

    <MemoizedSidebar
 projects={projects}
 isOpen={sidebarOpen}
 onRename={handleRename} // référence stable
 onDelete={deleteProject}
/>

    <div className={styles.content}>

     <div className={styles.toolbar}>

      {!showForm ? (

       <button
        className={styles.addBtn}
        onClick={() => setShowForm(true)}
       >
        + Nouveau projet
       </button>

      ) : (

       <ProjectForm
        submitLabel="Créer"
        onSubmit={(name: string, color: string) => {
         addProject(name, color)
         setShowForm(false)
        }}
        onCancel={() => setShowForm(false)}
       />

      )}

     </div>

     <MainContent columns={columns} />

    </div>

   </div>

  </div>

 )

}