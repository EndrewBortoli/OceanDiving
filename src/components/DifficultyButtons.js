import React from "react";

function DifficultyButtons({ difficulty, onSelect }) {
  return (
    <div className="difficulty-buttons">
      <button
        className={`button ${difficulty === "FÁCIL" ? "selected" : ""}`}
        onClick={() => onSelect("FÁCIL")}
      >
        EASY
      </button>
      <button
        className={`button ${difficulty === "hard" ? "selected" : ""}`}
        onClick={() => onSelect("HARD")}
      >
        HARD
      </button>
    </div>
  );
}

export default DifficultyButtons;
