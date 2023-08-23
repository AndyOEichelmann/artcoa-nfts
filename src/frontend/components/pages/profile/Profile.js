import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import AccountContext from '../../../context/AccountContext';

function Profile() {
  const { id } = useParams();
  
  const { acc, sig } = useContext(AccountContext);
  
  return (
    <div>
        <h4>{id}</h4>     
    </div>
  )
}

export default Profile