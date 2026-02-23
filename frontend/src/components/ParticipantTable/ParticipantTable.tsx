import { useEffect, useState } from 'react';
import './ParticipantTable.scss';
import api from '../../utils/api';
import Markdown from 'react-markdown';

const ParticipantTable = () => {
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [notes, setNotes] = useState<string>();


  const fetchParticipants = async () => {
    if (loading) return;
    setLoading(true);
    setParticipants(await api('/v1/meeting_prep'));
    setLoading(false);
  }

  const fetchNotes = async (id: number) => {
    setNotes((await api(`/v1/meeting_prep/${id}`)).notes);
  }

  useEffect(() => {
    fetchParticipants();
  }, [])

  return (
    <table className="participant-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Organization</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {participants.map(participant => {
          return (
            <tr key={participant.id}>
              <td>{participant.name}</td>
              <td>{participant.organization}</td>
              <td>{participant.status === 'ready' ? <button onClick={() => fetchNotes(participant.id)} className='ready-btn'>Ready! View Notes</button> : participant.status + '...'}</td>
            </tr>
          )
        })}
        {loading && <tr><td colSpan={3}>Loading...</td></tr>}
        {notes && <div className='notes-modal'>
          <button className='close-btn' onClick={() => setNotes(undefined)}>X</button>
          <div className='notes-modal-content'>
            <h2>Notes</h2>
            <Markdown>{notes}</Markdown>
          </div>
        </div>}
      </tbody>
    </table>
  );
}


export default ParticipantTable;