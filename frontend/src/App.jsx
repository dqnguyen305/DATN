import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import ChatBot from "./components/chatbot/ChatBot";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/layout/Footer";

function App() {

  return (
    <BrowserRouter>

      <div
        className="d-flex flex-column"
        style={{
          minHeight: "100vh"
        }}
      >

        <ScrollToTop />

        <div className="flex-grow-1">
          <AppRouter />
        </div>

        <ChatBot />

        <Footer />

      </div>

    </BrowserRouter>
  );

}

export default App;