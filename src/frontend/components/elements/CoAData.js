
const CoAData = ({ artist, title, properties }) => {

    const renderPro = (e) => {
        if(e.display_type){
            if(e.display_type === "date"){
                return(
                    <div key={`${e.trait_type}`}>
                        <h4>{e.trait_type}</h4>
                        <p>{e.value}</p>
                    </div>
                )
            } else {
                return(
                    <div key={`${e.trait_type}`}>
                        <h4>{e.trait_type}</h4>
                        <section>{renderType(e.value, e.trait_type)}</section>
                    </div>
                )
            }
        } else if(e.trait_type !== "Statement of Authenticity"){
            return(
                <div key={`${e.trait_type}`}>
                    <h4>{e.trait_type}</h4>
                    <p>{e.value}</p>
                </div>
            )
        }
    }

    const renderType = (value, trait) => {
        return(                
                value.map((v) => (
                    <section className='coa-data-type' key={`${trait}-${v.trait_type}`}>
                        <p>{v.trait_type}</p>
                        <p>{v.value}</p>
                    </section>
                ))
        )
    }

    return(
        <div className='coa-data'>
            <div>
              <h4>Work Title</h4>
              <p>{title}</p>
            </div>
            <div>
                <h4>Artist</h4>
                <p>{artist}</p>
            </div>
            {properties.map((e) => (
                renderPro(e)
            ))}
        </div>
    );
}

export default CoAData;