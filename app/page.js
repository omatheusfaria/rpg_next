'use client'
import styles from "./page.module.css";
import useGameManager from "@/hooks/gameManager";
import Image from "next/image"; // Importe o componente Image do Next.js

export default function Home() {
    const {heroi, vilao, log, turnoHeroi, handlerAcaoHeroi, gameOver, vencedor} = useGameManager();

    return (
        <div className={styles.containerPrincipal}>
            {/* Área Superior: Informações dos Combatentes */}
            <div className={styles.areaCombate}>
                {/* Imagem do Vilão */}
                <div className={styles.imagemVilao}>
                    {/* Exemplo: hitmontop.png para o vilão */}
                    <Image
                        src="https://img.pokemondb.net/sprites/black-white/anim/normal/conkeldurr.gif"
                        alt={heroi.nome}
                        width={400} // Aumentado para 250
                        height={400} // Aumentado para 250
                        unoptimized={true} // Use unoptimized para GIFs animados
                        priority
                    />
                </div>

                {/* Informações do Vilão */}
                <div className={styles.painelVilao}>
                    <div className={styles.infoPersonagem}>
                        <span className={styles.nomePersonagem}>{vilao.nome}</span>
                        <div className={styles.barraVidaExterna}>
                            <div
                                className={styles.barraVidaInterna}
                                style={{width: `${vilao.vida > 0 ? vilao.vida : 0}%`}}
                            ></div>
                        </div>
                        <span className={styles.vidaNumerica}>HP: {vilao.vida > 0 ? vilao.vida : 0}/100</span>
                    </div>
                </div>

                {/* Imagem do Herói */}
                <div className={styles.imagemHeroi}>
                    <Image
                        src="https://img.pokemondb.net/sprites/black-white/anim/back-normal/machamp.gif"
                        alt={heroi.nome}
                        width={400} // Aumentado para 250
                        height={400} // Aumentado para 250
                        unoptimized={true} // Use unoptimized para GIFs animados
                        priority
                    />
                </div>

                {/* Informações do Herói */}
                <div className={styles.painelHeroi}>
                    <div className={styles.infoPersonagem}>
                        <span className={styles.nomePersonagem}>{heroi.nome}</span>
                        <div className={styles.barraVidaExterna}>
                            <div
                                className={styles.barraVidaInterna}
                                style={{width: `${heroi.vida > 0 ? heroi.vida : 0}%`}}
                            ></div>
                        </div>
                        <span className={styles.vidaNumerica}>HP: {heroi.vida > 0 ? heroi.vida : 0}/100</span>
                    </div>
                </div>
            </div>

            {/* Área Inferior: Log de Eventos e Menu de Ações */}
            <div className={styles.areaInteracao}>
                {/* Log de Eventos */}
                <div className={styles.logBatalha}>
                    <p>{log}</p>
                </div>

                {/* Menu de Ações */}
                <div className={styles.menuAcoes}>
                    {gameOver ? (
                        <div className={styles.mensagemFinal}>
                            {vencedor === "heroi" ? (
                                <h2>Você venceu!</h2>
                            ) : (
                                <h2>Você perdeu!</h2>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className={styles.promptAcao}>O que {heroi.nome} deve fazer?</p>
                            <div className={styles.botoesAcao}>
                                <button onClick={() => handlerAcaoHeroi("atacar")} disabled={!turnoHeroi || gameOver}>Atacar</button>
                                <button onClick={() => handlerAcaoHeroi("defender")} disabled={!turnoHeroi || gameOver}>Defender</button>
                                <button onClick={() => handlerAcaoHeroi("usarPocao")} disabled={!turnoHeroi || gameOver}>Usar Poção</button>
                                <button onClick={() => handlerAcaoHeroi("correr")} disabled={!turnoHeroi || gameOver}>Fugir</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}