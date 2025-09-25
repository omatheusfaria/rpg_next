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

    const verificarFimDeJogo = (heroiVida, vilaoVida) => {
        if (heroiVida <= 0) {
            setVencedor("vilao")
            setGameOver(true)
            adicionarLog(`${vilao.nome} venceu a batalha!`)
            return true;
        } else if (vilaoVida <= 0) {
            setVencedor("heroi")
            setGameOver(true)
            adicionarLog(`${heroi.nome} venceu a batalha!`)
            return true;
        }
        return false;
    }

    const modificarVida = (alvo, dano) => {
        let novaVida = 0

        if (alvo === "heroi") {
            setHeroi(prev => {
                novaVida = Math.min(100, Math.max(0, prev.vida - dano))
                return { ...prev, vida: novaVida }
            })
        } else {
            setVilao(prev => {
                novaVida = Math.min(100, Math.max(0, prev.vida - dano))
                return { ...prev, vida: novaVida }
            })
        }

        return novaVida
    }

    // Ações do herói: Simplificado
    const acoesHeroi = {
        atacar: () => {
            let danoFinal = 80;
            if (vilaoDefendendo) {
                danoFinal = Math.round(danoFinal / 2);
                adicionarLog(`${vilao.nome} se defendeu, o dano foi reduzido pela metade!`);
                setVilaoDefendendo(false);
            }
            modificarVida("vilao", danoFinal)
            adicionarLog(`${heroi.nome} atacou ${vilao.nome} e causou ${danoFinal} de dano!`)
            return verificarFimDeJogo(heroi.vida, vilao.vida);
        },

        defender: () => {
            setHeroiDefendendo(true)
            adicionarLog(`${heroi.nome} assumiu uma postura defensiva!`)
            return false;
        },

        usarPocao: () => {
            modificarVida("heroi", -20)
            adicionarLog(`${heroi.nome} usou poção e regenerou 20 de vida!`)
            return verificarFimDeJogo(heroi.vida, vilao.vida);
        },

        correr: () => {
            adicionarLog(`${heroi.nome} tentou fugir!`)
            setVencedor("vilao")
            setGameOver(true)
            return true;
        }
    }

    const processarTurnoVilao = () => {
        if (gameOver || vilao.vida <= 0) {
            return;
        }

        const acoes = ["atacar", "defender", "usarPocao", "furia"]
        const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)]

        let danoFinal = danoVilao
        if (heroiDefendendo) {
            danoFinal = Math.round(danoFinal / 2)
            adicionarLog(`${heroi.nome} se defendeu, o dano foi reduzido pela metade!`)
            setHeroiDefendendo(false)
        }

        let jogoAcabou = false;

        switch (acaoAleatoria) {
            case "atacar": {
                modificarVida("heroi", danoFinal)
                if (vilaoEmFuria) {
                    adicionarLog(`${vilao.nome} atacou furiosamente ${heroi.nome} e causou ${danoFinal} de dano!`)
                } else {
                    adicionarLog(`${vilao.nome} atacou ${heroi.nome} e causou ${danoFinal} de dano!`)
                }
                jogoAcabou = verificarFimDeJogo(heroi.vida, vilao.vida)
                break
            }
            case "defender": {
                setVilaoDefendendo(true)
                adicionarLog(`${vilao.nome} assumiu uma postura defensiva!`)
                jogoAcabou = verificarFimDeJogo(heroi.vida, vilao.vida)
                break
            }
            case "usarPocao": {
                modificarVida("vilao", -10)
                adicionarLog(`${vilao.nome} usou poção e regenerou 10 de vida!`)
                jogoAcabou = verificarFimDeJogo(heroi.vida, vilao.vida)
                break
            }
            case "furia": {
                if (danoVilao === 10) {
                    setDanoVilao(danoVilao * 2)
                    setVilaoEmFuria(true)
                    adicionarLog(`${vilao.nome} entrou em um estado de FÚRIA! Seu dano dobrou!`)
                } else {
                    modificarVida("heroi", danoFinal)
                    adicionarLog(`${vilao.nome} atacou furiosamente ${heroi.nome} e causou ${danoFinal} de dano!`)
                    jogoAcabou = verificarFimDeJogo(heroi.vida, vilao.vida)
                }
                break
            }
        }

        if (!jogoAcabou) {
            setTurnoHeroi(true);
        }
    }

    const handlerAcaoHeroi = (acao) => {
        if (!turnoHeroi || gameOver) return

        setTurnoHeroi(false);
        const jogoAcabou = acoesHeroi[acao]?.()
        console.log(jogoAcabou)
        setTimeout(() => {
            if (!jogoAcabou) {
            processarTurnoVilao()
            }
        }, 3000)
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