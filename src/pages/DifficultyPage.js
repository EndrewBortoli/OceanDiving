import * as THREE from 'three';
import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Water } from 'three-stdlib';
import '../styles/Difficulty.css';
import LpContent from '../components/LpContent.js';
import backgroundMusic from '../assets/sounds/background_water.mp3';
import waterNormalsTexture from '../assets/waternormals.jpeg';
import { useNavigate } from 'react-router-dom';

extend({ Water });

function Ocean({ speed }) {
  const ref = useRef();
  const gl = useThree((state) => state.gl);

  const waterNormals = useLoader(THREE.TextureLoader, waterNormalsTexture); 
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x003249,
      distortionScale: 0,
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals, gl.encoding]
  );

  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta * speed));

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
}

export default function App() {
  const [difficulty, setDifficulty] = useState('MÉDIO');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio(backgroundMusic));
  const navigate = useNavigate();

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 1;
    audio.muted = true;
    
    audio.play().then(() => {
      audio.muted = false;
    }).catch((error) => console.log("Falha ao iniciar o áudio automaticamente:", error));
    
    return () => {
      audio.pause();
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getSpeed = () => {
    switch (difficulty) {
      case 'FÁCIL':
        return 0.5;
      case 'MÉDIO':
        return 1;
      case 'DÍFICIL':
        return 2;
      default:
        return 1;
    }
  };

  const setDifficultyAndSave = (level) => {
    setDifficulty(level);
    localStorage.setItem('selectedDifficulty', level);
  };

  const goToNextPage = () => {
    navigate("/main");
  };

  const goToHelpPage = () => {
    navigate("/informative"); // Redireciona para a página de ajuda
  };

  return (
    <>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 5, 100], fov: 55, near: 1, far: 20000 }}>
          <pointLight position={[100, 100, 100]} />
          <pointLight position={[-100, -100, -100]} />
          <Suspense fallback={null}>
            <Ocean speed={getSpeed()} />
          </Suspense>
          <Sky scale={1000} sunPosition={[0, 0, 50]} sunColor="yellow" turbidity={6} rayleigh={2} />
        </Canvas>
        <div className="black-overlay"></div>
      </div>

      <div className="lp-content-container">
        <LpContent setDifficulty={setDifficultyAndSave} />
      </div>

      {/* Botão de Mute */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 11,
          padding: '10px 20px',
          backgroundColor: isMuted ? 'rgb(15, 16, 88)' : '#1CAAD9',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      {/* Botão de Interrogação */}
      <button
        onClick={goToHelpPage}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 11,
          padding: '10px 20px',
          backgroundColor: '#1CAAD9',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        ?
      </button>

      <button className="start-mission-button" onClick={goToNextPage}>
        COMEÇAR MISSÃO
      </button>
    </>
  );
}
