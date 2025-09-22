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

    const verificarFimDeJogo = () => {
        if (heroi.vida <= 0) {
            setVencedor("vilao")
            setGameOver(true)
            adicionarLog(`${vilao.nome} venceu a batalha!`)
            return true;
        } else if (vilao.vida <= 0) {
            setVencedor("heroi")
            setGameOver(true)
            adicionarLog(`${heroi.nome} venceu a batalha!`)
            return true;
        }
        return false;
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
        }
    }

    const handlerAcaoVilao = () => {
        if(gameOver) return

        const acoes = ["atacar", "defender", "usarPocao", "furia"]
        const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)]

        let danoFinal = danoVilao
        if (heroiDefendendo) {
            danoFinal = Math.round(danoFinal / 2)
            adicionarLog(`${heroi.nome} se defendeu, o dano foi reduzido pela metade!`)
            setHeroiDefendendo(false)
        }

        switch (acaoAleatoria) {
            case "atacar":
                modificarVida("heroi", danoFinal)
                if (vilaoEmFuria) {
                    adicionarLog(`${vilao.nome} atacou furiosamente ${heroi.nome} e causou ${danoFinal} de dano!`)
                } else {
                    adicionarLog(`${vilao.nome} atacou ${heroi.nome} e causou ${danoFinal} de dano!`)
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
                    // Se o dano já foi dobrado, apenas ataque
                    modificarVida("heroi", danoFinal)
                    adicionarLog(`${vilao.nome} atacou furiosamente ${heroi.nome} e causou ${danoFinal} de dano!`)
                }
                break
        }
        setTurnoHeroi(true)
        verificarFimDeJogo()
    }

    const handlerAcaoHeroi = (acao) => {
        if (!turnoHeroi || gameOver) return

        acoesHeroi[acao]?.()

        const jogoAcabou = verificarFimDeJogo()

        setTimeout(() => {
            if (!jogoAcabou) {
                handlerAcaoVilao()
            }
        }, 2000)
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