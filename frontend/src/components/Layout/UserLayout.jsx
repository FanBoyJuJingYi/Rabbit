import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Topbar from "./Topbar";

const UserLayout = () => {
  return (
    <>
      {/* Header */}
      <Topbar />
      <Header />
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
