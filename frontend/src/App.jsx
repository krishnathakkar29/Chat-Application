import axios from "axios";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loader";
import { server } from "./config";
import Login from "./pages/Login";
import { userExists, userNotExists } from "./redux/reducers/authSlice";
import { SocketProvider } from "./socket/Socket";

const Home = lazy(() => import("./pages/Home"));
const Chat = lazy(() => import("./pages/Chat"));

function App() {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExists(data.user));
      })
      .catch((err) => {
        console.log(err);
        dispatch(userNotExists());
      });
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route
              element={
                <SocketProvider>
                  <ProtectRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
            </Route>
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </>
  );
}

export default App;
