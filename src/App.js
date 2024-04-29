import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Header from "./component/header";
import Footer from "./component/footer";
import Home from "./pages/home";
import Launchpad from "./pages/launchpad";
import Staking from "./pages/staking";
import Claims from "./pages/claims.js";
import Profile from "./pages/profile";
import Gs from "./theme/globalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import PoolDetail from "./pages/PoolDetail/PoolDetail";
import PoolDetails from "./pages/ViewPoolDetails";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store"; // Import the store and persistor
import { Provider } from 'react-redux';

function App() {
  const [isDark, setDarkTheme] = useState(true);
  const selectedTheme = theme(isDark);

  function setTheme(flag) {
    setDarkTheme(flag);
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ThemeProvider theme={selectedTheme}>
            <section className="bodySection clearfix">
              <Gs.GlobalStyle />
              <Header isDarkTheme={isDark} setTheme={setTheme} />
              <Routes>
                <Route path="/" exact element={<Home isDarkTheme={isDark} />} />
                <Route
                  path="/launchpad"
                  exact
                  element={<Launchpad isDarkTheme={isDark} />}
                />
                {/* <Route
              path="/pool_detail/upcoming/:id"
              element={<PoolDetail isDarkTheme={isDark} />}
            />
            <Route path="/pool_detail/featured/:id" element={<PoolDetail />} /> */}
                <Route
                  path="/staking"
                  exact
                  element={<Staking isDarkTheme={isDark} />}
                />
                <Route
                  path="/claims"
                  exact
                  element={<Claims isDarkTheme={isDark} />}
                />
                <Route
                  path="/user-profile"
                  exact
                  element={<Profile isDarkTheme={isDark} />}
                />
                <Route
                  path="/pool_detail/upcoming/:id"
                  exact
                  element={<PoolDetails isDarkTheme={isDark} />}
                />
                <Route
                  path="/pool_detail/Active/:id"
                  exact
                  element={<PoolDetails isDarkTheme={isDark} />}
                />
                <Route
                  path="/pool_detail/completed/:id"
                  exact
                  element={<PoolDetails isDarkTheme={isDark} />}
                />
                <Route
                  path="/pool_detail/Enrolling/:id"
                  exact
                  element={<PoolDetails isDarkTheme={isDark} />}
                />
                <Route
                  path="/pool_detail/REGCompleted/:id"
                  exact
                  element={<PoolDetails isDarkTheme={isDark} />}
                />
              </Routes>
              <Footer isDarkTheme={isDark} setTheme={setTheme} />
            </section>
          </ThemeProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

const RightBX = styled.div`
  width: calc(100% - 240px);
  background-image: url("${(props) => props.theme.RBXbg}");
  background-repeat: no-repeat;
  background-position: top left;
  background-size: cover;
  min-height: 100vh;
`;
export default App;
