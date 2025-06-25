import "./home.css";
import HomePage from "../assets/HomePage-Background.jpg";

export default function Home(){
    return (
      <>
        <div
          style={{ backgroundImage: `url(${HomePage})` }}
          className="home-container"
        >
          <div className="text">WELCOME TO INVOICE GENERATOR!</div>
        </div>
      </>
    );
}