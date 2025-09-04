import { useEffect, useRef, useState } from "react";
import bgMusic from "../assets/battle_music.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const tryPlay = () => {
      if (audio && !isPlaying) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("Autoplay prevented. Music will play after user interaction.");
        });
      }
    };

    document.addEventListener("click", tryPlay, { once: true });
    return () => {
      document.removeEventListener("click", tryPlay);
    };
  }, [isPlaying]);

  return (
    <audio ref={audioRef} loop preload="auto">
      <source src={bgMusic} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default BackgroundMusic;