import {createContext, useState, ReactNode, useContext} from "react";

interface IEpisode {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string,
}

interface IPlayerContext {
    episodeList: IEpisode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    isLooping: boolean,
    isShuffling: boolean,
    play: (episode: IEpisode) => void,
    playList: (list: IEpisode[], index: number) => void,
    togglePlay: () => void,
    toggleLoop: () => void,
    toggleShuffle: () => void,
    setPlayingState: (state: boolean) => void,
    hasNext: boolean,
    hasPrevious: boolean,
    playNext: () => void,
    playPrevious: () => void,
    clearPlayerState: () => void,
}

interface IPlayerContextProviderProps {
    children: ReactNode,
}

export const PlayerContext = createContext({} as IPlayerContext);

export function PlayerContextProvider({ children }: IPlayerContextProviderProps ) {
    
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const hasNext = ( currentEpisodeIndex +1 ) < episodeList.length;
    const hasPrevious = isShuffling || currentEpisodeIndex > 0;

    function play( episode: IEpisode ) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList( list: IEpisode[], index: number ) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function playNext() {
        if( isShuffling ){
            const nextRandomEpisodeIndex = Math.floor( Math.random() * episodeList.length )

            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
            
        } else if(hasNext) {
            setCurrentEpisodeIndex( currentEpisodeIndex +1 );
        }
    }

    function playPrevious() {
        if(hasPrevious) {
            setCurrentEpisodeIndex( currentEpisodeIndex -1 );
        }
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return(
        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play, 
            playList,
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
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

//PARA NÃO TER QUE IMPORTAR TANTO O useContextx COMO O PlayerContext
export const usePlayerContext = () => {
    return useContext(PlayerContext);
}