import { GetStaticProps } from "next";
import Img from "next/image";
import {format, parseISO} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import { api } from "../services/api";

import styles from "./home.module.scss";

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

interface IHomeProps {
  latestEpisodes: IEpisode[],
  allEpisodes: IEpisode[]
}

export default function Home({ latestEpisodes, allEpisodes }: IHomeProps ) {
 
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return(
              <li key={episode.id}>
                <Img 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar Episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Img 
                        width={120} 
                        height={120} 
                        src={episode.thumbnail} 
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <a href="">{episode.title}</a>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  
  /*COMO É FEITO COM FETCH
  const response = await fetch("http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc");
  const data = await response.json();
  */


  //FEITO COM AXIOS
  const { data } = await api.get("/episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  })

  const formatedData = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {locale: ptBR}),
      thumbnail: episode.thumbnail,
      description: episode.description,
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = formatedData.slice(0, 2); //PEGANDO OS PRIMEIROS 2 EPISÓDIOS
  const allEpisodes = formatedData.slice(2, formatedData.lenght); //PEGANDO A PARTIR DO TERCEIRO

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, 
  }
}
//revalidate : De quanto em quanto tempo gostaria de gerar uma nova versão dessa página em segundos, nesse exemplo de 8 em 8h
