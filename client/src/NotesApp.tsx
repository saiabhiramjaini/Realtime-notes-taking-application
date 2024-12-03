import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const NotesApp: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const socket = io('http://localhost:4000');

  useEffect(() => {
    if (!roomId) return;

    // Join the room
    socket.emit('join_room', roomId);

    // Listen for current notes when joining the room
    socket.on('current_notes', (notes: string[]) => {
      setNotes(notes);
    });

    // Listen for updated notes
    socket.on('update_notes', (updatedNotes: string[]) => {
      setNotes(updatedNotes);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleAddNote = () => {
    if (newNote.trim() === '') return;
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setNewNote('');
    // Send updated notes to the server
    socket.emit('update_notes', roomId, updatedNotes);
  };
  

  return (
    <div>
      <h2>Collaborative Notes - Room {roomId}</h2>
      <div>
        <ul>
          {notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a new note"
      />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default NotesApp;
