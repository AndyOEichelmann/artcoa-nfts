import { useRouteError } from "react-router-dom";

function ProfileError() {
    const error = useRouteError();
    
    return (
        <div className="coa-error">
            <h2>Errot</h2>
            <p>{error.message}</p>
        </div>
    )
}

export default ProfileError