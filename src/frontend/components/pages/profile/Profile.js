import { useContext } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import AccountContext from '../../../context/AccountContext';
import Gallery from '../../elements/Gallery';

function Profile() {
  const { id } = useParams();

  const ownedCoAs = useLoaderData();

  const { acc } = useContext(AccountContext);
  
  return (
    <div className='profile-info'>
      <section className='profile-data'>
        <div>
          {id === acc.account
            ? <h4>My address</h4>
            : <h4>Chain address</h4>
          }
          <p>{id}</p>
        </div>
      </section>

      <section>
        <h3>Transfer certificate</h3>
        <form>
          {/* select certificate */}
          <div>
            <label htmlFor="certificate">Certificate</label>
            <input type="text" name='certificate' placeholder='select certificate' />
          </div>
          {/* to hoom */}
          <div>
            <label htmlFor="certificate">To</label>
            <input type="text" name='certificate' placeholder='reciver address' />
          </div>
        </form>
      </section>

      <section className='my-gallery'>
        <h3>My Gallery</h3>
        { ownedCoAs && <Gallery acoa={ownedCoAs} /> }
      </section>
    </div>
  )
}

export default Profile