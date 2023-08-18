import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

// layouts
import RooLayout from './components/layouts/RootLayout';

// pages
import Home from './components/pages/home/Home';
import HomeError from './components/pages/home/HomeError';

import CoA from './components/pages/coa/CoA';
import CoAError from './components/pages/coa/CoAError';

import CreateCoA from './components/pages/CreateCoA';

import NotFound from './components/pages/NotFound';

// loaders
import { coaLoader, galleryLoader } from './loaders/CoALoader';

// import logo from './logo.svg';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RooLayout />}>
      {/* --- DEFULT ROUTE { Home } PAGE --- */}
      <Route
        index
        element={<Home />}
        loader={galleryLoader}
        errorElement={<HomeError />}
      />

      <Route 
        path='createcertificate' 
        element={<CreateCoA />} 
        // action={certificateAction} 
      />

      {/* --- rout correctly the info <Rp cert> <Rc token /> <Rp />--- */}
      <Route 
        // path='certificate-:id'
        path=':id' 
        element={<CoA />}
        loader={coaLoader}
        // errorElement={<CoAError />}
      />

      {/* --- DEFAULT ROUT FOR NON EXISTING ROUTES --- */}
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

// npm run start