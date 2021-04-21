import { useEffect } from "react";


export default function Home(props ) { /*Esse props vem de getServerSideProps se usando SSR ou de getStaticProps se usando SSG*/
  /*Usando SPA Single Page Application
    Não funciona com os motores de busca por exemplo google
  
  useEffect(() => {
    fetch("http://localhost:3333/episodes").
    then(response => response.json()).
    then(data => console.log(data));
  }, [])
  
  */

  return (
    <div>
      <h1>Main Page</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

//Usando SSG Static Site Generation do Next
//É possivel determinar quantas vezes por dia ele vai recarregar as informações da página

export async function getStaticProps() {
  
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8, 
  }
}
//revalidate : De quanto em quanto tempo gostaria de gerar uma nova versão dessa página em segundos, nesse exemplo de 8 em 8h


/*Usando SSR Server Side Rendering do Next
  Executa sempre que alguém acessar a página

export async function getServerSideProps() {
  
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();

  return {
    props: {
      episodes: data
    }
  }
}
*/