import { useLoaderData } from "react-router-dom";

// layouts
import Gallery from "../../elements/Gallery";

const Home = () => {
    
    // costum hook
// const { data: acoa, isLoading, error } = useFetch('http://localhost:8000/certificates');

const { acoa, unique } = useLoaderData(); 

// console.log(`acoa:`, acoa, `| unique: ${unique}`);

return (
    <div className="home">
        {/* {unique && <ArtistNav unique={unique}/>} */}
        <h2>Art Gallery</h2>
        { acoa && <Gallery acoa={acoa} /> }
    </div>
);
}

export default Home;