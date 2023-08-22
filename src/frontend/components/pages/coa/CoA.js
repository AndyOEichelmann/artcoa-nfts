import { useLoaderData, useParams } from 'react-router-dom';

// elements
import CoAData from '../../elements/CoAData';
import Issuer from '../../elements/Issuer';


export default function CoA() {
    const { id } = useParams();

    const { coa, coaname, owner, date, ledger } = useLoaderData();
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

      <div className="coa-blockdata">
        <h5>Blockchain Info</h5>
        <div>
            <h4>Contract</h4>
            <section>
                <h4>name</h4>
                <p>{coaname}</p>
                <h4>address</h4>
                <p>{((id.split('-'))[0]).slice(0, 20)}...</p>
            </section>
        </div>
        <div>
            <h4>Token ID</h4>
            <p>{(id.split('-'))[1]}</p>
        </div>
        <div>
            <h4>Registered Date</h4>
            <p>{new Date(date).toLocaleDateString("en-US")}</p>
        </div>
        <div>
            <h4>Current Owner</h4>
            <p>{owner.slice(0, 6)}...{owner.slice(owner.length - 4)}</p>
        </div>
      </div>
    </div>

      <div className='coa-history'>
        <h3>Ledger</h3>
      </div>
    </div>
  )
}