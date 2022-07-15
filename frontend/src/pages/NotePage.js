import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from "react-router-dom";
import {ReactComponent as ArrowLeft} from '../assets/arrow-left.svg'

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const NotePage = () => {

  let params = useParams(null)
  const navigate = useNavigate();

  const [note, setNote] = useState()

  useEffect(() => {
    getNote()
  }, [params.id])

  let getNote = async ()=> {
    if (params.id === 'new') return
    let response = await fetch(`/api/notes/${params.id}`)
    let data  = await response.json()
    setNote(data)
  }

  let createNote = async () => {
    fetch(`/api/notes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(note)
    })
  }

  let updateNote = async () => {
    fetch(`/api/notes/${params.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(note)
    })
  }

  let handleSubmit = () =>{
    if (params.id !== 'new' && note.body === '') {
      deleteNote()
    } else if (params.id !== 'new') {
      updateNote()
    } else if (params.id === 'new' && note.body !== null) {
      createNote()
    }
    navigate('/')
  }

  let deleteNote = async () => {
    fetch(`/api/notes/${params.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      }
    })
    navigate('/')
  }

  return (
    <div className='note'>
        <div className='note-header'>
          <h3>
            <ArrowLeft onClick={handleSubmit} />
          </h3>
          {params.id !== 'new' ? (
            <button onClick={deleteNote}>Delete</button>
          ) : (
            <button onClick={handleSubmit}>Done</button>
          )}
          
        </div>
        <textarea value={note?.body} onChange={(updatedNote) => {setNote({...note, 'body': updatedNote.target.value})}}>
        </textarea>
    </div>
  )
}

export default NotePage