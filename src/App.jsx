import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Schemes from "./pages/Schemes";
import BottomBar from "./components/BottomBar";
import Header from "./components/Header";
import SchemesDetails from "./pages/SchemesDetails";
import AiBot from "./pages/AiBot";
import LandingPage from "./pages/LandingPage";
import WelcomeScreen from "./pages/WelcomeScreen";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {!isLandingPage && <Header />}
      {children}
      {!isLandingPage && <BottomBar />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/details/:id" element={<SchemesDetails />} />
          <Route path="/aibot" element={<AiBot />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
