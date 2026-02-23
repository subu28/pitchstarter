import { useState } from 'react';
import './Header.scss';
import api from '@/utils/api';

const Header = () => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);

  const addParticipant = async () => {
    if (!name || !organization) {
      alert('Please enter a name and organization');
      return;
    }
    setLoading(true);
    await api('/v1/meeting_prep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        organization
      })
    });
    document.location.reload();
  }


  return (
    <>
      <div className="header">Pitch Starter<button className="add-btn" onClick={() => {setAdding(true)}}>+ Add</button></div>
      {adding && <div className="add-modal">
        <button className="close-btn" onClick={() => {setAdding(false)}}>X</button>
        <div className='add-modal-content'>
          <h2>Add Participant</h2>
          <form onSubmit={e => {e.stopPropagation(); e.preventDefault()}}>
            <input type="text" value={name} onChange={e => setName(e.target.value)}placeholder="Name" />
            <input type="text" value={organization} onChange={e => setOrganization(e.target.value)}placeholder="Organization" />
            <button onClick={addParticipant} disabled={loading}>Add</button>
          </form>
        </div>
      </div>}
    </>
  );
}

export default Header;