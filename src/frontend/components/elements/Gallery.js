import { Link } from "react-router-dom";

const Gallery = ({ acoa }) => {

    return (
        <div className="gallery">
            {acoa.map((coa) => (
                <Link 
                    // to={'/certificate-' + coa.contract.address + '-' + coa.tokenId.toString()}
                    to={'/certificate/' + coa.contract.address + '-' + coa.tokenId}

                    className="coa-preview obj-img" 
                    
                    key={`${coa.contract.address}-${coa.tokenId}`}
                    
                    style={{ backgroundImage: `linear-gradient(0deg, #f2f2f2 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), url(${coa.rawMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')})`}}
                >
                    <h2>{ coa.rawMetadata.title}</h2>
                    <p>by {coa.rawMetadata.artist}</p>
                </Link>
            ))}
        </div>
    );
}

export default Gallery;