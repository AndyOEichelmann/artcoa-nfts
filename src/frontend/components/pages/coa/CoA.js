import { useLoaderData } from 'react-router-dom';

// elements
import CoAData from '../../elements/CoAData';
import Issuer from '../../elements/Issuer';


export default function CoA() {
    // const { id } = useParams();

    const { coa, owner } = useLoaderData();
    //console.log('coa:',coa);

  return (
    <div>
      <div className='coa-page'>
        <div className='coa-img'>
          <img src={coa.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={`${coa.title} by ${coa.artist}`} />
        </div>
        
        <Issuer issuers={coa.issuers} />
        <CoAData artist={coa.artist} title={coa.title} properties={coa.properties} />

        <div className='coa-statement'>
          <h4>Statement of Authenticity</h4>
          <p>{coa.description}</p>
        </div>
      </div>

      <div className='coa-history'>
        <h3>Ledger</h3>
      </div>
    </div>
  )
}