
const CoALedger = ({ ledger }) => {

    const renderItem = (e) => {
        return(
            <section className="ledger-element" key={`tx-${e.transactionHash}`} >
                <p>{(e.transactionHash).slice(0, 10)}...</p>
                <p>{new Date(e.timestamp).toLocaleDateString("en-US")}</p>
                <p>{(e.from).slice(0, 10)}...</p>
                <p>{(e.to).slice(0, 10)}...</p>
            </section>
        )
    }
  
    return (
    <div className="ledger">
        <section className="ledger-header">
            <h4>Transaction</h4>
            <h4>Date</h4>
            <h4>From</h4>
            <h4>To</h4>
        </section>
        <section className="ledger-data">
            {
                ledger.map(e => (
                    renderItem(e)
                ))
            }
        </section>
    </div>
  )
}

export default CoALedger