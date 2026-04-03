import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../api/axios"

interface Column {
 id: string
 title: string
 tasks: string[]
 projectId: string
}

export default function ProjectDetail() {

 const { id } = useParams()

 const [columns, setColumns] = useState<Column[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {

  async function fetchColumns() {

   try {

    const res = await api.get(`/columns?projectId=${id}`)

    setColumns(res.data)

   } catch (e) {

    console.error(e)

   } finally {

    setLoading(false)

   }

  }

  fetchColumns()

 }, [id])

 if (loading) return <div>Chargement...</div>

 return (

  <div style={{ padding: "20px" }}>

   <h2>Project {id}</h2>

   <div style={{ display: "flex", gap: "20px" }}>

    {columns.map(col => (

     <div
      key={col.id}
      style={{
       background: "#f1f1f1",
       padding: "10px",
       borderRadius: "6px",
       width: "200px"
      }}
     >

      <h3>{col.title}</h3>

      {col.tasks.map((task, i) => (
       <div key={i}>{task}</div>
      ))}

     </div>

    ))}

   </div>

  </div>

 )

}