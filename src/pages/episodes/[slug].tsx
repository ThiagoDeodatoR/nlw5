import { GetStaticPaths, GetStaticProps } from "next";
import Img from "next/image";
import Link from "next/link";

import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import ptBR from "date-fns/locale/pt-BR";

import {convertDurationToTimeString} from "../../utils/convertDurationToTimeString";
import { usePlayerContext } from "../../contexts/PlayerContext";

import styles from "./episode.module.scss";

import { api } from "../../services/api";



interface IEpisode {
    id: string,
    title: string,
    members: string,
    publishedAt: number,
    thumbnail: string,
    description: string,
    duration: number,
    durationAsString: string,
    url: string,
}

interface IEpisodeProps {
    episode: IEpisode,
}

function Episode({ episode }: IEpisodeProps) {

    const { play } = usePlayerContext();
    
    return(
        <div className={styles.episodeContainer}>
            <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Img 
                    width={700} 
                    height={350} 
                    src={episode.thumbnail} 
                    objectFit="cover"
                />
                <button type="button" onClick={ () => play(episode) }>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{ __html: episode.description }} //EXISTE TAGS <p> DENTRO DO DESCRIPTION, ISSO FORÇA A CONVERSÃO PRA HTML
            />
            </div>
        </div>
    )
}

export default Episode;

//NECESSÁRIO QUANDO TRABALHANDO COM PÁGINAS STATIC QUE PODEM SER DINÂNIMAS QUE RECEBEM PARÂMETRO. exemplo: [slug].tsx
//paths: PAGINAS QUE QUISER DEIXAR PRÉ-CARREGADAS; fallback: 'blocking': Next GERA AS PÁGINAS CONFORME FOREM ACESSADAS
export const getStaticPaths: GetStaticPaths = async () => { 

    const { data } = await api.get("/episodes", {
        params: {
          _limit: 2,
          _sort: "published_at",
          _order: "desc"
        }
      })

    const paths = data.map( episode => {
        return {
            params: {
                slug: episode.id,
            }
        }
    })  

    return {                                        
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    
    const { slug } = context.params;
    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {locale: ptBR}),
        thumbnail: data.thumbnail,
        description: data.description,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        url: data.file.url,
    }

    return{
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, //24 HORAS
    }
}