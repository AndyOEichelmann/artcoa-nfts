import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import AccountContext from '../../../context/AccountContext';
import Gallery from '../../elements/Gallery';

// import coaaddress from '../../contract-data/ERC721CoA-address.json';
import coaabi from '../../../contract-data/ERC721CoA.json';
import escrowaddress from '../../../contract-data/ERC721CoA_Escrow-address.json';
import escrowabi from '../../../contract-data/ERC721CoA_Escrow.json';

function Profile() {
  const { id } = useParams();

  const ownedCoAs = useLoaderData();

  const { acc } = useContext(AccountContext);

  const [formMsg, setFormMsg] = useState('');

  async function listCoA(e) {
    e.preventDefault();
    
    // get elements
    const getCoA = document.getElementById('coa').value; 
    const claimer = document.getElementById('address').value;

    // if elements are filled list certificate
    if(getCoA !== '' && claimer !== ''){
      console.log('coa:', getCoA, 'address:', claimer);
      // separate coa information
      const arg = getCoA.split('-');
        console.log('coa info:', arg)

      try{
        // obtain info to list coa
          // get web provider - metamask
        const provider = await new ethers.BrowserProvider(window.ethereum);

          // get signer
        const signer = await provider.getSigner();

          // set up proxy for escrow contract
        const escrowcoacontract = new ethers.Contract(escrowaddress.address, escrowabi.abi, signer);

          // set up proxy fro erc721 contract
        const coacontract = new ethers.Contract(arg[0], coaabi.abi, signer);

        // verify and approve for all the contract address
        const isApproved = await coacontract.isApprovedForAll(acc.account, escrowaddress.address);
          console.log('contact approved for all:', isApproved);
          // if not approved for all call function
        if(!isApproved){
          await coacontract.setApprovalForAll(escrowaddress.address, true);
        }

        // list certificate
        await escrowcoacontract.listCertificate(arg[0], arg[1], claimer);
        
        setFormMsg('certificate listed')
      } catch (error) {
        console.log(error)
        alert('could not list certificate');
        setFormMsg('')
      }

    } else {
      setFormMsg('fill all elements, you have missed one or more');
    }

    // clear filled
    document.getElementById('coa').value = '';
    document.getElementById('address').value = '';

    // if not disply err message
  }
  
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

      {id === acc.account
        && <section className='transfer-cert'>
            <h3>List certificate to be transfered</h3>

            <form id='listFor'>
              {/* select certificate */}
              <div>
                <label name="certificate">Certificate</label>
                <select name="certificate" id='coa'>
                  <option value="">select</option>
                  {ownedCoAs.map((coa) => {
                    return(
                      <option value={`${coa.contract.address}-${coa.tokenId}`} key={`${coa.contract.address}-${coa.tokenId}`}>{coa.title}</option>
                    )
                  })}
                </select>
              </div>
              {/* to hoom */}
              <div>
                <label name="claimer">Claimer</label>
                <input type="text" name='claimer' id='address' placeholder='reciver address (ex. 0x... )' />
              </div>
              {formMsg !== '' && <p className='formMsg'>{formMsg}</p> }
              {/* button */}
              <button onClick={listCoA}>transfer</button>
            </form>
           </section> 
      }

      <section className='my-gallery'>
        {id === acc.account
          ? <h3>My Gallery</h3>
          : <h3>Account Gallery</h3>
        }
        
        { ownedCoAs && <Gallery acoa={ownedCoAs} /> }
      </section>
    </div>
  )
}

export default Profile