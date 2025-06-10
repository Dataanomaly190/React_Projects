import React, {useState} from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "./App.css"
import BackgroundVideo from "./assets/QR_Code_Video_Clip.mp4";

export default function App(){
  const [TextInput, setTextInput] = useState('');
  const [ChangedValue, setChangedValue] = useState('');
  const [ClickState, setClickState] = useState(false);

  const textInputValue = (event) => {
    const TextValue = event.target.value;
    setTextInput(TextValue);
  }

  const HandleClick = () => {
    if(TextInput && ChangedValue !== TextInput){
      setChangedValue(TextInput);
      setClickState(true);
    }
  }

  const handleDelete = () => {
    setChangedValue('');
    setClickState(false);
    setTextInput('');
  }

  return (
    <>
      <div className="video_wrapper">
        <video autoPlay muted loop playsInline>
          <source src={BackgroundVideo} type="video/mp4" />
          This video format is not supported by current browser!
        </video>
      </div>
      <div className="container">
        <div>
          <h1 className="heading">QR Code Generator!</h1>
        </div>
        <div className="input_panel">
          <div>
            <input
              type="text"
              placeholder="Enter text to Generate QR Code..."
              className="input"
              value={TextInput}
              onChange={textInputValue}
            />
          </div>
          <div>
            <button type="button" onClick={HandleClick} className="button">
              Enter
            </button>
            <button type="button" onClick={handleDelete} className="button">
              Delete
            </button>
          </div>
        </div>
        <div className="qr_container">
          <strong className="strong">QR Code:-</strong>
          <div className="qr_output_panel">
            {ChangedValue && ClickState && (
              <div>
                <QRCodeSVG value={ChangedValue} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
