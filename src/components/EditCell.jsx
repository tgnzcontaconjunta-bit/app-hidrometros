import { useState, useRef, useEffect } from 'react'

export default function EditCell({ value, onChange, className = '', placeholder = '', multiline = false, style = {} }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef(null)

  useEffect(() => { setDraft(value) }, [value])

  function start() {
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    setEditing(false)
    if (draft !== value) onChange(draft)
  }

  function onKey(e) {
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setEditing(false); setDraft(value) }
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select?.()
    }
  }, [editing])

  if (editing) {
    const Tag = multiline ? 'textarea' : 'input'
    return (
      <Tag
        ref={inputRef}
        className={`edit-input ${className}`}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        placeholder={placeholder}
        style={style}
        rows={multiline ? 2 : undefined}
      />
    )
  }

  return (
    <div
      className={`edit-cell ${className}`}
      onDoubleClick={start}
      onClick={start}
      title="Clique para editar"
      style={style}
    >
      {value || <span className="placeholder">{placeholder}</span>}
    </div>
  )
}
