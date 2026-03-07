import styles from './Header.module.css';
interface HeaderProps {
 title: string
 onMenuClick: () => void
 userName?: string
 onLogout?: () => void
}
export default function Header({ title, onMenuClick, userName, onLogout }: HeaderProps) {

 return (

  <header className={styles.header}>

   <div className={styles.right}>
    <button onClick={onMenuClick}>☰</button>
    <h1>{title}</h1>
   </div>

   <div>

    {userName && <span>{userName}</span>}

    {onLogout && (
      <button onClick={onLogout}>
        Logout
      </button>
    )}

   </div>

  </header>

 )

}