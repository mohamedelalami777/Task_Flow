import { useState } from "react"

interface Props {
 submitLabel: string
 onSubmit: (name: string, color: string) => void
 onCancel: () => void
}

export default function ProjectForm({
 submitLabel,
 onSubmit,
 onCancel
}: Props) {

 const [name, setName] = useState("")
 const [color, setColor] = useState("#3498db")

 function handleSubmit(e: React.FormEvent) {
  e.preventDefault()

  if (!name.trim()) return

  onSubmit(name, color)

  setName("")
 }

 return (

  <form style={{display:"flex", gap:"10px"}} onSubmit={handleSubmit}>

   <input
    type="text"
    placeholder="Nom du projet"
    value={name}
    onChange={e => setName(e.target.value)}
   />

   <input
    type="color"
    value={color}
    onChange={e => setColor(e.target.value)}
   />

   <button type="submit">
    {submitLabel}
   </button>

   <button type="button" onClick={onCancel}>
    Annuler
   </button>

  </form>

 )
}