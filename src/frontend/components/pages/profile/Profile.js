import { useParams } from 'react-router-dom';

function Profile() {
    const { id } = useParams();

  return (
    <div>
        <h4>{id}</h4>
    </div>
  )
}

export default Profile