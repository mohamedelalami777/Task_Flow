import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'

interface Project {
 id: string
 name: string
 color: string
}

interface SidebarProps {
 projects: Project[]
 isOpen: boolean
 onRename: (id: string, name: string) => void
 onDelete: (id: string) => void
}

export default function Sidebar({
 projects,
 isOpen,
 onRename,
 onDelete
}: SidebarProps) {

 return (

  <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>

   <h2 className={styles.title}>Mes Projets</h2>

   <ul className={styles.list}>

    {projects.map(p => (

     <li key={p.id} className={styles.item}>

      <NavLink
       to={`/projects/${p.id}`}
       className={styles.link}
      >

       <span
        className={styles.dot}
        style={{ background: p.color }}
       />

       {p.name}

      </NavLink>

      <div className={styles.actions}>

       <button
        onClick={() => {
         const newName = prompt("Nouveau nom du projet", p.name)
         if (newName) onRename(p.id, newName)
        }}
       >
        ✏️
       </button>

       <button
        onClick={() => onDelete(p.id)}
       >
        🗑️
       </button>

      </div>

     </li>

    ))}

   </ul>

  </aside>

 )

}