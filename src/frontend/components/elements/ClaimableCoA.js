
function ClaimableCoA({ claimItem }) {
  return (
    <> 
            {/* {console.log('claim items:', claimItem)} */}
            {claimItem.map(item => (
                <div key={`${item.coaaddress}-${item.tokenId}`}>

                <section className='item-img'>
                    <img src={item.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt="f" />
                </section>
                <p>{item.titile}</p>
                <p>{item.tokenId}</p>
                <p>{(item.coaaddress).slice(0,7)}...</p>
                <p>{item.itemId}</p>
                <p>{(item.sender).slice(0,7)}...</p>
                <button onClick={(e) => {
                    e.preventDefault()
                    claimCoA(item.itemId)
                }}>claim</button>

                {console.log('item loadaed', item.itemId)}
                </div>
            ))}
    </>
  )
}

export default ClaimableCoA