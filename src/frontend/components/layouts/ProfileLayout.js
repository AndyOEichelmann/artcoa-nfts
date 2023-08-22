import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
    return (
    <div className="coa">
        <h2>Profile</h2>
        <Outlet />
    </div>
    )
  }