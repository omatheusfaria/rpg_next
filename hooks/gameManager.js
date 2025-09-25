'use client'
import {useState} from "react";

export default function useGameManager() {
    const heroiInicial = {vida: 100, nome: "Machamp"}
    const vilaoInicial = {vida: 100, nome: "Conkeldurr"}

    const [heroi, setHeroi] = useState(heroiInicial)
    const [vilao, setVilao] = useState(vilaoInicial)
    const [log, setLog] = useState("A batalha começou!")
    const [turnoHeroi, setTurnoHeroi] = useState(true)
    const [danoVilao, setDanoVilao] = useState(10)
    const [vilaoEmFuria, setVilaoEmFuria] = useState(false)
    const [vilaoDefendendo, setVilaoDefendendo] = useState(false)
    const [heroiDefendendo, setHeroiDefendendo] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [vencedor, setVencedor] = useState(null)


    const adicionarLog = (mensagem) => {
        setLog(mensagem)
    }

    const modificarVida = (alvo, dano) => {
        const setter = alvo === "heroi" ? setHeroi : setVilao
        setter(prev => {
            const novaVida = Math.min(100, Math.max(0, prev.vida - dano))
            return { ...prev, vida: novaVida }
        })
    }

    const acoesHeroi = {
        atacar: () => {
            let danoFinal = 10;
            if (vilaoDefendendo) {
                danoFinal = Math.round(danoFinal / 2);
                adicionarLog(`${vilao.nome} se defendeu, o dano foi reduzido pela metade!`);
                setVilaoDefendendo(false);
            }
            modificarVida("vilao", danoFinal)
            adicionarLog(`${heroi.nome} atacou ${vilao.nome} e causou ${danoFinal} de dano!`)
            if (vilao.vida - danoFinal <= 0) {
                setGameOver(true)
                setVencedor("heroi")
                adicionarLog(`${heroi.nome} venceu a batalha!`)
                return true
            }
        },

        defender: () => {
            setHeroiDefendendo(true)
            adicionarLog(`${heroi.nome} assumiu uma postura defensiva!`)
        },

        usarPocao: () => {
            modificarVida("heroi", -20)
            adicionarLog(`${heroi.nome} usou poção e regenerou 20 de vida!`)
        },

        correr: () => {
            adicionarLog(`${heroi.nome} tentou fugir!`)
            setVencedor("vilao")
            setGameOver(true)
            return true
        }
    }

    const handlerAcaoVilao = () => {
        if(gameOver) return

        const acoes = ["atacar", "defender", "usarPocao", "furia"]
        const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)]

        let danoFinal = danoVilao

        switch (acaoAleatoria) {
            case "atacar":
                if (heroiDefendendo) {
                    danoFinal = Math.round(danoFinal / 2)
                    adicionarLog(`${heroi.nome} se defendeu, o dano foi reduzido pela metade!`)
                    setHeroiDefendendo(false)
                }
                modificarVida("heroi", danoFinal)
                if (vilaoEmFuria) {
                    adicionarLog(`${vilao.nome} atacou furiosamente ${heroi.nome} e causou ${danoFinal} de dano!`)
                } else {
                    adicionarLog(`${vilao.nome} atacou ${heroi.nome} e causou ${danoFinal} de dano!`)
                }
                if (heroi.vida - danoFinal <= 0) {
                    setGameOver(true)
                    setVencedor("vilao")
                    adicionarLog(`${heroi.nome} venceu a batalha!`)
                }
                break
            case "defender":
                setVilaoDefendendo(true)
                adicionarLog(`${vilao.nome} assumiu uma postura defensiva!`)
                break
            case "usarPocao":
                modificarVida("vilao", -10)
                adicionarLog(`${vilao.nome} usou poção e regenerou 10 de vida!`)
                break
            case "furia":
                if (danoVilao === 10) {
                    setDanoVilao(danoVilao * 2)
                    setVilaoEmFuria(true)
                    adicionarLog(`${vilao.nome} entrou em um estado de FÚRIA! Seu dano dobrou!`)
                } else {
                    if (heroiDefendendo) {
                        danoFinal = Math.round(danoFinal / 2)
                        adicionarLog(`${heroi.nome} se defendeu, o dano foi reduzido pela metade!`)
                    }
                    modificarVida("heroi", danoFinal)
                    adicionarLog(`${vilao.nome} atacou furiosamente ${heroi.nome} e causou ${danoFinal} de dano!`)
                }
                if (heroi.vida - danoFinal <= 0) {
                    setGameOver(true)
                    setVencedor("vilao")
                    adicionarLog(`${heroi.nome} venceu a batalha!`)
                }
                break
        }
        setTurnoHeroi(true)
    }

    const handlerAcaoHeroi = (acao) => {
        if (!turnoHeroi || gameOver) return

        const jogoAcabou = acoesHeroi[acao]?.()
        if (!jogoAcabou) {
            setTimeout(() => {
                handlerAcaoVilao()
            }, 2000)
        }
    }

    return {
        heroi,
        vilao,
        log,
        turnoHeroi,
        handlerAcaoHeroi,
        gameOver,
        vencedor
    }
}