import { Route, Routes } from "react-router-dom";

import Header from "./components/layout/Header/Header.jsx";
import HomePage from "./pages/public/HomePage/HomePage.jsx";

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
      </Routes>
    </div>
  );
}

export default App;