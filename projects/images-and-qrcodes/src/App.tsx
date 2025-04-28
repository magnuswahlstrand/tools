import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

const animals = [
  { name: 'elephant', image: '/images/elephant.png' },
  { name: 'giraffe', image: '/images/giraffe.png' },
  { name: 'horse', image: '/images/horse.png' },
  { name: 'dog', image: '/images/dog.png' },
  { name: 'cat', image: '/images/cat.png' },
  { name: 'grouse', image: '/images/grouse.png' },
  { name: 'hedgehog', image: '/images/hedgehog.png' },
  { name: 'mouse', image: '/images/mouse.png' },
  { name: 'ant', image: '/images/ant.png' },
];

function App() {
  return (
    <div className="app">
      <div className="grid">
        {animals.map((animal) => (
          <div key={animal.name} className="card">
            <img 
              src={animal.image} 
              alt={animal.name} 
              className="animal-image"
            />
            <div className="qr-container">
              <QRCodeSVG 
                value={animal.name}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 