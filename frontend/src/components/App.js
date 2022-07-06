import Layout from './Layout';
import Home from './pages/Home';
import About from './pages/About';
import Restaurant from './restaurant/Restaurant';
import NotFound from './pages/NotFound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="restaurant" element={<Restaurant />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
