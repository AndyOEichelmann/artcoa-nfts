import { Outlet } from "react-router-dom";

export default function CoALayout() {
    return (
    <div className="coa">
        <h2>Certificate of Authenticity</h2>
        <Outlet />
    </div>
    )
  }