import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footers from "../components/common/Footers";
import Chatbot from "../components/common/Chatbot";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footers />
      <Chatbot variant="floating" />
    </div>
  );
}

export default MainLayout;
