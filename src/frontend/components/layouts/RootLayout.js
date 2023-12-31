import { Outlet } from "react-router-dom";

import Navbar from "../elements/Navbar";

export default function RooLayout() {
    return (
      <div className='App'>
          <Navbar />
          <div className="content">
            <Outlet />
          </div>
      </div>
    )
  }