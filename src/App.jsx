import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Schemes from "./pages/Schemes";
import BottomBar from "./components/BottomBar";
import Header from "./components/Header";
import SchemesDetails from "./pages/SchemesDetails";
import AiBot from "./pages/AiBot";


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/details/:id" element={<SchemesDetails/>}/>
        <Route path="aibot" element={<AiBot/>}/>
      </Routes>

      <BottomBar />
    </Router>
  );
};

export default App;
