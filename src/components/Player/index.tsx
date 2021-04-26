import { useEffect, useRef, useState } from 'react';
import { usePlayerContext } from '../../contexts/PlayerContext';

import Img from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './styles.module.scss';

function Player() {

    const audioRef = useRef<HTMLAudioElement>(null); //USADO SE QUISERMOS ALTERAR ALGUMA COISA DENTRO DE UM ELEMENTO HTML
    const [progress, setProgress] = useState(0);

    const { episodeList, 
            currentEpisodeIndex, 
            isPlaying,
            isLooping, 
            isShuffling,
            togglePlay, 
            toggleLoop,
            toggleShuffle,
            setPlayingState,
            hasNext,
            hasPrevious,
            playNext,
            playPrevious, 
            clearPlayerState,
        } = usePlayerContext();

    const episode = episodeList[currentEpisodeIndex];

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener("timeupdate", () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleDrag( amount: number ) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
            setProgress(0);
        }
    }

    useEffect( () => {
        if(!audioRef.current) {
            return;
        }

        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying] )

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando Agora</strong>
            </header>

            {episode ? (
                <div className={styles.playingPlayer}>
                    <Img 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover">
                    </Img>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}
            
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString( progress )}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleDrag}
                                trackStyle={{ backgroundColor: "#04d361" }}
                                railStyle={{ backgroundColor: "#9f75ff" }}
                                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString( episode?.duration ?? 0 )}</span>
                </div>

                {episode && (
                    <audio 
                        src={episode.url} 
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay 
                        onPlay={ () => setPlayingState(true) } //PLAY AND PAUSE COM O TECLADO
                        onPause={ () => setPlayingState(false) } 
                        onLoadedMetadata={setupProgressListener}
                        onEnded={handleEpisodeEnded}
                    />
                )}

                <div className={styles.playerButtons}>
                    <button 
                        type="button" 
                        className={isShuffling ? styles.isActive : ''}
                        onClick={toggleShuffle}
                        disabled={!episode || episodeList.length === 1}
                    >
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode} 
                        onClick={ togglePlay }
                    >
                        
                    {isPlaying 
                        ? <img src="/pause.svg" alt="Pausar"/>
                        : <img src="/play.svg" alt="Tocar"/> 
                    }
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button 
                        type="button" 
                        className={isLooping ? styles.isActive : ''}
                        onClick={toggleLoop}
                        disabled={!episode}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>     
                </div>
            </footer>
        </div>
    );
}

export default Player;