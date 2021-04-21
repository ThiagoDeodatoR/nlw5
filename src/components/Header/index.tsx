import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';


function Header() {
    /* MANEIRA COMPLICADA DE FAZER O DATE
    const date = new Date();
    const days = [
        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sab"
    ]
    const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]
    const dateFormated = `
        ${days[date.getDay()]},  
        ${date.getDate()} 
        ${months[date.getMonth()]} 
        ${date.getFullYear()}
    `*/

    /* PROCUREM POR BIBLIOTECAS (nesse caso date-fns), PODEM FACILITAR MUITO SUA VIDA */
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    });

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr Logo"/>
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
        </header>
    );
}

export default Header;