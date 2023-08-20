import { useLoaderData } from 'react-router-dom';

// elements
import CoAData from '../../elements/CoAData';
import Issuer from '../../elements/Issuer';


export default function CoA() {
    // const { id } = useParams();

    const coa = useLoaderData();
    //console.log('coa:',coa);

    // retrive statement --- must be chainged once the json data is fixed
    const statementData = (e) => {
      if(e.trait_type === "Statement of Authenticity"){
        return(
          <div className='coa-statement' key={`${e.trait_type}`}>
            <h4>{e.trait_type}</h4>
            <p>{e.value}</p>
          </div>
        )
      }
    } 

  return (
    <div className='coa-page'>
      <div className='coa-img'>
        <img src={coa.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={`${coa.title} by ${coa.artist}`} />
      </div>
      <Issuer issuers={coa.issuers} />
      <CoAData artist={coa.artist} title={coa.title} properties={coa.properties} />
      {/**
       * change in metadata the statement from { coa.properties[n].trait_type:"Statement of Auth" } to { coa.description } 
       */}
       <>
        {coa.properties.map((e) => (
          statementData(e)
        ))}
       </>
      {/* 
          <div className='coa-statement'>
            <h4>Statement</h4>
            <p>{coa.metadata.properties.statement}</p>
          </div>
      */}
    </div>
  )
}