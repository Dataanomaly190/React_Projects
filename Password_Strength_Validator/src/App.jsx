import React, { useState } from "react";
import underline from "./assets/underline.png";
import BackgroundVideo from "./assets/background_video_clip/cyber-skull.mp4";
import "./App.css";

export default function App() {
  const [Password, setPassword] = useState("");
  const [Strength, setStrength] = useState("");
  const password = (event) => {
    const new_password = event.target.value;
    setPassword(new_password);
    strength(new_password);
  };

  const strength = (encryption) => {
    if (encryption === "") {
      setStrength("");
      return;
    }
    const pass = encryption.split("");
    const All_Special_Characters = "~!@#$%^&*()_+-={}[]|:;'<>,.?'\"";
    const Capital_Letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const Small_Letters = "abcdefghijklmnopqrstuvwxyz";
    const Numbers = "0123456789";
    const found_special_Characters = pass.filter((char) =>
      All_Special_Characters.includes(char)
    );
    const found_capital_letters = pass.filter((char) =>
      Capital_Letters.includes(char)
    );
    const found_small_letters = pass.filter((char) =>
      Small_Letters.includes(char)
    );
    const found_numbers = pass.filter((char) => Numbers.includes(char));
    if (
      found_special_Characters.length > 0 &&
      found_capital_letters.length > 0 &&
      found_small_letters.length > 0 &&
      found_numbers.length > 0
    ) {
      if (encryption.length > 15) {
        setStrength("Very Strong!!!");
      } else if (encryption.length > 10) {
        setStrength("Strong!!");
      } else if (encryption.length > 5) {
        setStrength("Weak!");
      } else {
        setStrength("Very Weak X");
      }
    } else if (
      (found_special_Characters.length > 0 ||
        found_capital_letters.length > 0 ||
        found_small_letters.length > 0 ||
        found_numbers.length > 0) &&
      Password.includes(" ")
    ) {
      setStrength("WRONG PASSWORD!");
    } else {
      setStrength("WRONG PASSWORD!");
    }
  };

  return (
    <>
      <div className="video_wrapper">
        <video autoPlay muted loop playsInline>
          <source src={BackgroundVideo} type="video/mp4" />
          This Video format is not supported by current browser!
        </video>
      </div>
      <div className="container">
        <h1 className="heading">PASSWORD STRENGTH VALIDATOR</h1>
        <div className="password_field">
          <span>
            <strong className="password_content">Enter Password: </strong>
            <input
              className="input"
              type="password"
              placeholder="Password..."
              value={Password}
              onChange={password}
            ></input>
          </span>
          <strong className="password_content">Password Strength: </strong>
          <strong
            className={
              Strength === "WRONG PASSWORD!"
                ? "wrong"
                : Strength === "Very Weak X"
                ? "very_weak"
                : Strength === "Weak!"
                ? "weak"
                : Strength === "Strong!!"
                ? "strong"
                : Strength === "Very Strong!!!"
                ? "powerful"
                : ""
            }
          >
            {" " + Strength}
          </strong>
        </div>
        <div className="instruction_panel">
          <h3 className="instruction_heading">Note</h3>
          <img src={underline} alt="img" className="image" />
          <div className="content_panel">
            <ul>
              <li>
                Password must contain at least 5 characters, including
                uppercase, lowercase, numbers, and special characters otherwise
                invalid.
              </li>
              <li>
                Password must not contain spaces or be less than 16 characters
                long.
              </li>
              <li>
                Password must not be easily guessable by a brute force,
                dictionary or any other type of attack.
              </li>
              <li>
                Password is categorized as follows:
                <br />
                <ul className="ul">
                  <li>
                    <strong>
                      Very Weak X (Very Weak): Less than 5 characters.
                    </strong>
                  </li>
                  <li>
                    <strong>Weak! (Weak): Less than 10 characters.</strong>
                  </li>
                  <li>
                    <strong>Strong!! (Strong): Less than 15 characters.</strong>
                  </li>
                  <li>
                    <strong>
                      Very Strong!!! (Very Strong): More than 15 characters.
                    </strong>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
