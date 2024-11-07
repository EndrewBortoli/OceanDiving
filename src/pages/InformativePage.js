import React, { useEffect, useRef, useState } from 'react';
import WaterWave from 'react-water-wave';
import Image1 from "../assets/wallpaper/wallpaper.jpg";
import Image2 from "../assets/wallpaper/wallpaperMed.jpg";
import Image1800 from "../assets/wallpaper/wallpaper1800.jpg";
import Image1500 from "../assets/wallpaper/wallpaper1500.jpg";
import ImageSmall from "../assets/wallpaper/imageSmall.jpg";
import ImageSmaller from "../assets/wallpaper/imageSmaller.jpg";
import backgroundMusic from "../assets/sounds/waveSound.mp3";
import "../styles/Informatitve.css";
import { motion } from 'framer-motion';

function LandingPage() {
    const [isMuted, setIsMuted] = useState(false); // Estado para mute
    const audioRef = useRef(new Audio(backgroundMusic)); // Referência para o áudio

    useEffect(() => {
        const audio = audioRef.current;
        
        // Configuração do áudio para iniciar automaticamente com mute
        audio.loop = true;
        audio.volume = 1;
        audio.muted = true;
        
        // Inicia o áudio e remove o mute após o play
        audio.play().then(() => {
            audio.muted = false;
        }).catch((error) => console.log("Falha ao iniciar o áudio automaticamente:", error));
        
        return () => {
            audio.pause();
        };
    }, []);

    const toggleMute = () => {
        const audio = audioRef.current;
        audio.muted = !isMuted; // Alterna entre mute e unmute
        setIsMuted(!isMuted);   // Atualiza o estado para refletir no botão
    };

    const getBackgroundImage = (width, height) => {
        if (width < 450 && height < 675) {
            return ImageSmaller;
        } else if (width < 670 && height < 1000) {
            return ImageSmall;
        } else if (width < 1500 && height < 1000) {
            return Image1500;
        } else if (width < 1800 && height < 1200) {
            return Image1800;
        } else if (width < 2100 && height < 1400) {
            return Image2;
        } else {
            return Image1;
        }
    };

    const goBack = () => {
        window.history.back(); // Volta para a página anterior
    };

    return (
        <motion.div id="landingPage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 5 }}
        >
            <WaterWave
                imageUrl={getBackgroundImage(window.innerWidth, window.innerHeight)}
                dropRadius={40}
                className="waterWaveCanvas"
                perturbance={0.01}
                resolution={400}
            >
                {({ pause, play }) => (
                    <div id="landingPageContent">
                        <div id="landingPageTextContainer">
                            <h1>OceanDiving</h1>
                            <h2>Aprenda sobre o mar e ganhe emblema colecionáveis!</h2>
                        </div>
                        <h3>Clique na água para gerar ondas!</h3>
                    </div>
                )}
            </WaterWave>

            {/* Botão de Mute */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 11,
                    padding: '10px 20px',
                    backgroundColor: isMuted ? '#1CAAD9' : 'rgb(15, 16, 88)', // Cor depende do estado
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {isMuted ? 'Unmute' : 'Mute'}
            </button>

            {/* Botão de Voltar */}
            <button
                onClick={goBack}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 11,
                    padding: '10px 20px',
                    backgroundColor: 'rgb(15, 16, 88)', // Cor fixa
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Voltar
            </button>
        </motion.div>
    );
}

export default LandingPage;
