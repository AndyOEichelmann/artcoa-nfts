
const CoAChainData = ({ id, coaname, date, owner }) => {

    const dateoptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

  return (
    <div className="coa-blockdata">
        <h4 className="coachain-section">Blockchain Info</h4>
        <div>
            <h4>Contract</h4>
            <section>
                <h5>name</h5>
                <h5>address</h5>
                <p>{coaname}</p>
                <p>{((id.split('-'))[0]).slice(0, 20)}...</p>
            </section>
        </div>
        <div>
            <h4>Token ID</h4>
            <p className="coachain-info">{(id.split('-'))[1]}</p>
        </div>
        <div>
            <h4>Registered Date</h4>
            <p className="coachain-info">{new Date(date).toLocaleDateString("en-US", dateoptions)}</p>
        </div>
        <div>
            <h4>Current Owner</h4>
            <p className="coachain-info">{owner}</p>
        </div>
    </div>
  )
}

export default CoAChainData