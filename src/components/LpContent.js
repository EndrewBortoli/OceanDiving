import React, { useState } from "react";
import "../styles/SelectionComponent.css";
import mediumImage from '../assets/animal2.jpg';
import hardImage from '../assets/animal3.jpg';
import logo from '../assets/logooceanspace.png';
import easyImage from '../assets/emblemainicio.jpg';


const LpContent = ({ setDifficulty }) => {
  const options = [
    { label: "FÁCIL", text: "Explorador", image: easyImage },
    { label: "MÉDIO", text: "Detetive", image: mediumImage },
    { label: "DÍFICIL", text: "Engenheiro", image: hardImage },
  ];
  const [currentIndex, setCurrentIndex] = useState(1); // Start at "MÉDIO"

  const handleSelection = (index) => {
    setCurrentIndex(index);
    setDifficulty(options[index].label); // Update difficulty in the parent component
  };

  return (
    <div className="selection-container">
      <img src={logo} alt="Ocean Logo" className="logo" />
      <h1>OCEANDIVING</h1>
      <p className="text">
        Bem-vindo ao mundo da exploração subaquática, explorador! Você foi selecionado para participar do programa <strong>OCEAN DIVING</strong>, onde realizará missões incríveis nos oceanos de todo o planeta. Sua tarefa será explorar as profundezas do mar e gerar relatórios detalhados sobre fenômenos monitorados por tecnologias de sensoriamento remoto.        
      </p>
      <h6>Selecione a dificuldade:</h6>

      <div className="image-selection">
        {options.map((option, index) => (
          <div
            key={option.label}
            className={`image-button ${index === currentIndex ? 'selected' : ''}`}
            onClick={() => handleSelection(index)} // Modificado para permitir seleção direta
          >
            <img src={option.image} alt={`${option.label} icon`} />
            <p>{option.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LpContent;
