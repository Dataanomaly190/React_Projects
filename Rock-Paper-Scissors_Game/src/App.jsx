import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [ID, setID] = useState(0);
  const [RandomNumber, setRandomNumber] = useState(0);
  const [Won, setWon] = useState(0);
  const [Lost, setLost] = useState(0);
  const [Draw, setDraw] = useState(0);
  const [GameResult, setGameResult] = useState("");
  const [UserResponse, setUserResponse] = useState("");

  const RandomNumberGenerator = () => {
    return Math.floor(Math.random() * 3) + 1;
  };

  const handleID = (choice) => {
    if (ID === 0 || ID !== 0) {
      setID(choice);
    }
    const number = RandomNumberGenerator();
    setRandomNumber(number);
    determineResult(choice, number);
  };

  const determineResult = (ID, number) => {
    let result;

    if(ID === 1)  setUserResponse("ROCK");
    else if(ID === 2) setUserResponse("PAPER");
    else setUserResponse("SCISSORS");

    if (number === 1) {
      if (ID === 1) {
        setDraw((prev) => prev + 1);
        result = "DRAW!!!";
      } else if (ID === 2) {
        setWon((prev) => prev + 1);
        result = "YOU WON!!!";
      } else if (ID === 3) {
        setLost((prev) => prev + 1);
        result = "COMPUTER WON!!!";
      }
    } else if (number === 2) {
      if (ID === 1) {
        setLost((prev) => prev + 1);
        result = "COMPUTER WON!!!";
      } else if (ID === 2) {
        setDraw((prev) => prev + 1);
        result = "DRAW!!!";
      } else if (ID === 3) {
        setWon((prev) => prev + 1);
        result = "YOU WON!!!";
      }
    } else if (number === 3) {
      if (ID === 1) {
        setWon((prev) => prev + 1);
        result = "YOU WON!!!";
      } else if (ID === 2) {
        setLost((prev) => prev + 1);
        result = "COMPUTER WON!!!";
      } else if (ID === 3) {
        setDraw((prev) => prev + 1);
        result = "DRAW!!!";
      }
    }
    setGameResult(result);
  };

  const handleComputerResponse = () => {
    if (RandomNumber === 1) return "ROCK";
    if (RandomNumber === 2) return "PAPER";
    if (RandomNumber === 3) return "SCISSORS";
    return "";
  };

  const handleReset = () => {
    setID(0);
    setRandomNumber(0);
    setWon(0);
    setLost(0);
    setDraw(0);
    setGameResult("");
    setUserResponse("");
  };

  return (
    <>
      <div className="container">
        <h1 className="heading">WELCOME TO THE ROCK, PAPER, SCISSORS GAME</h1>
        <div className="decision_box">
          <p className="para">Choose from the given options:-</p>
          <button id="option" onClick={() => handleID(1)} className="button">
            ROCK
          </button>
          <button id="option" onClick={() => handleID(2)} className="button">
            PAPER
          </button>
          <button id="option" onClick={() => handleID(3)} className="button">
            SCISSORS
          </button>
        </div>
        <div className="game_container">
          <div className="result">
            <div className="result_box_One">
              <div className="user_response">
                <h1>Your Response: </h1>
                <h3>{UserResponse}</h3>
              </div>
              <div className="computer_response">
                <h1>Computer Response:</h1>
                <h3>{" " + handleComputerResponse()}</h3>
              </div>
            </div>
            <h1
              className={
                GameResult === "YOU WON!!!"
                  ? "win"
                  : GameResult === "COMPUTER WON!!!"
                  ? "lose"
                  : GameResult === "DRAW!!!"
                  ? "draw"
                  : "default"
              }
            >
              <strong>{GameResult}</strong>
            </h1>
          </div>
          <div className="scoreboard">
            <div>
              <h1>SCOREBOARD:-</h1>
            </div>
            <div className="conclusion">
              <span>WON :- {" " + Won}</span>
              <span>LOST :- {" " + Lost}</span>
              <span>DRAW :- {" " + Draw}</span>
            </div>
          </div>
        </div>
        <div className="reset_button">
          <button className="button" onClick={handleReset}>
            <strong>Reset</strong>
          </button>
        </div>
      </div>
    </>
  );
}
