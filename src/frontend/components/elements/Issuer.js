
const Issuer = ({ issuers }) => {

    return (
        <div className='coa-issuers'>
            {issuers.map((issuer) => (
                <div key={`${issuer.trait_type}-${issuer.name}`}>
                    <div className="coa-issuer-signature">
                        <img src={issuer.signature.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={`${issuer.name} signature`}/>
                    </div>
                    <div className="coa-issuer-info">
                        <div>
                            <h4>Issuer</h4>
                            <p>{issuer.name}</p>
                        </div>
                        <div>
                            <h4>Type</h4>
                            <p>{issuer.trait_type}</p>
                        </div>
                        <div>
                            <h4>Address</h4>
                            <p>{issuer.address.slice(0,6)}...{issuer.address.slice(issuer.address.length - 3)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Issuer;