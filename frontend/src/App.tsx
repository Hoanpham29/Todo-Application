import { useState } from "react";
import { HomePage } from "./layout/Homepage/Homepage";
import { Navbar } from "./layout/NavbarAndFooter/Navbar";
import { Slidebar } from "./layout/NavbarAndFooter/Slidebar";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { TodoPage } from "./layout/TodoPage/TodoPage";
import { LoginPage } from "./layout/AuthPage/Loginpage";
import { RegisterPage } from "./layout/AuthPage/Registerpage";
import { Adminpage } from "./layout/AdminPage/Adminpage";
import { Changepasswordpage } from "./layout/ChangePasswordPage/Changepasswordpage";

export const App = () => {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const isMobile = window.innerWidth < 768;

  return (

    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>

        <div className="d-flex flex-column vh-100">
          <Navbar toggle={() => setOpen(prev => !prev)} />

          <div className="d-flex flex-grow-1 position-relative">
            
            <div
              className="border-end bg-white"
              style={{
                width: isMobile ? "300px" : open ? "300px" : "0px",
                overflow: "hidden",
                transition: "all 0.3s ease",

                position: isMobile ? "fixed" : "static",
                height: "100%",
                zIndex: 1050,

                transform: isMobile
                  ? open
                    ? "translateX(0)"
                    : "translateX(-100%)"
                  : "none"
              }}
            >
              <Slidebar open={open} refresh={refresh} />
            </div>

            {isMobile && open && (
              <div
                onClick={() => setOpen(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.3)",
                  zIndex: 1040
                }}
              />
            )}

            <div className="flex-grow-1 overflow-auto p-3 bg-secondary bg-opacity-10 w-75">
              <Route path={'/'} exact>
                <Redirect to='/home' />
              </Route>
              <Route exact path="/home">
                <HomePage setRefresh={setRefresh} refresh={refresh} />
              </Route>
              <Route exact path="/admin">
                <Adminpage />
              </Route>
              <Route exact path="/profile">
                <Changepasswordpage />
              </Route>
              <Route path="/todos/:id">
                <TodoPage setRefresh={setRefresh} />
              </Route>
            </div>
          </div>
        </div>
      </Switch>
    </Router>
  );
};