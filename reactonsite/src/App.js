import React from "react";
import "./App.css";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Components/Header";
import Fotter from "./Components/Fotter";

function App(){
    return (
        <>
            <Header />
            <Fotter />
        </>
    );
}
export default App;