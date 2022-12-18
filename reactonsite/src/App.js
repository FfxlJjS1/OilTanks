import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Components/Header";
import Fotter from "./Components/Fotter";

function App() {
    return (
        <>
            <Header className="content-container"/>
            <Fotter className="footer"/>
        </>
    );
}

export default App;