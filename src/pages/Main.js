import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import CardWithAnimatedText from '../components/CardWithAnimatedText';
import MissionBriefing from '../components/MissionBriefing';
import { useHistory } from 'react-router-dom'; // Para redirecionamento
import '../styles/App.css';
import lowResEarth from '../assets/earth-min-1.jpg';
import backgroundMusic from '../assets/sounds/background_space.mp3';

function Main({ missions }) {
  const globeEl = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ringsData, setRingsData] = useState([]);
  const [pointsData, setPointsData] = useState([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(backgroundMusic));
  const history = useHistory(); // Hook de redirecionamento

  // Função para salvar o estado das missões no localStorage
  const saveMissionStatus = (missionId, status) => {
    let missionsStatus = JSON.parse(localStorage.getItem('missionsStatus')) || {};
    missionsStatus[missionId] = status;
    localStorage.setItem('missionsStatus', JSON.stringify(missionsStatus));
  };

  const loadMissionStatus = () => {
    return JSON.parse(localStorage.getItem('missionsStatus')) || {};
  };

  const gData = missions.map(
    (mission) => ({
      lat: mission.lat,
      lng: mission.lng,
      title: mission.title,
      location: mission.location,
      image: mission.image,
      text: mission.text,
      maxR: 10,
      propagationSpeed: 4,
      repeatPeriod: 1000,
      color: loadMissionStatus()[mission.id] === 'completed' ? 'green' : 'red', // Se a missão foi concluída, fica verde
      mission,
      id: mission.id,
    })
  );

  // Function to pause the audio in Main
  const pauseMainAudio = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false); // Update the state to reflect that the audio has been paused
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    audio.volume = 3 / 20;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.loop = true;
      audio.play().catch(error => console.log('Audio play failed:', error));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current.volume = 3 / 20;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRingsData(gData.filter(mission => loadMissionStatus()[mission.id] !== 'completed'));
      setPointsData(gData.map(e => ({
        lat: e.lat,
        lng: e.lng,
        color: loadMissionStatus()[e.id] === 'completed' ? "green" : e.color,
        altitude: 0.0001,
      })));
      setIsInteractive(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [gData]);

  const handleClick = (e) => {
    if (!isInteractive) return;

    const { lat, lng } = e;

    for (const ring of gData) {
      const distance = Math.sqrt(
        Math.pow(lat - ring.lat, 2) + Math.pow(lng - ring.lng, 2)
      );

      if (distance < ring.maxR * 1.2) {
        globeEl.current.pointOfView({ lat: ring.lat, lng: ring.lng, altitude: 0.4 }, 1000);

        setTimeout(() => {
          setSelectedPoint(ring);
          setIsModalOpen(true);
        }, 1500);

        return;
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoint(null);
    globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 1.4 }, 1000);
  };

  // Função para marcar a missão como concluída
  const markMissionAsCompleted = (missionId) => {
    saveMissionStatus(missionId, 'completed');
    setRingsData(gData.filter(mission => loadMissionStatus()[mission.id] !== 'completed'));
    setPointsData(gData.map(e => ({
      lat: e.lat,
      lng: e.lng,
      color: loadMissionStatus()[e.id] === 'completed' ? "green" : e.color,
      altitude: 0.0001,
    })));

    // Verifica se todas as missões foram concluídas
    const allCompleted = gData.every(mission => loadMissionStatus()[mission.id] === 'completed');
    if (allCompleted) {
      history.push('/completed'); // Redireciona para uma página de conclusão
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50px', top: 'calc(50% - 80px)', zIndex: 10, pointerEvents: 'none' }}>
        <CardWithAnimatedText />
      </div>
      <div style={{ position: 'relative', zIndex: 9, pointerEvents: 'all' }}>
        <Globe
          ref={globeEl}
          globeImageUrl={lowResEarth}
          ringsData={ringsData}
          ringColor="color"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          onGlobeClick={handleClick}
          pointsData={pointsData}
          pointAltitude="altitude"
          pointColor={(point) => point.color}
          pointRadius={0.3}
        />
      </div>
      {selectedPoint && (
        <MissionBriefing
          isOpen={isModalOpen}
          onClose={closeModal}
          missionData={selectedPoint}
          markMissionAsCompleted={markMissionAsCompleted} // Passa a função para o modal
          pauseMainAudio={pauseMainAudio}
        />
      )}
      <button
        onClick={toggleAudio}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 11,
          padding: '10px 20px',
          backgroundColor: isPlaying ? '#f44336' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isPlaying ? 'Mute' : 'Unmute'}
      </button>
    </div>
  );
}

export default Main;
