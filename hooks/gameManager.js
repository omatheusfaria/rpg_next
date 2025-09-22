'use client'
import {useState} from "react";

export default function useGameManager() {
    const heroiInicial = {vida: 100, nome: "Hornet"}
    const vilaoInicial = {vida: 100, nome: "Knight"}

    const [heroi, setHeroi] = useState(heroiInicial)
    const [vilao, setVilao] = useState(vilaoInicial)
    const [log, setLog] = useState(true)
    const [turnoHeroi, setTurnoHeroi] = useState(true)

    const modificarVida = (alvo, dano) => {
        const setter = alvo === "heroi" ? setHeroi : setVilao
        setter(prev => ({ ...prev, vida: prev.vida - dano }))
    }

    const adicionarLog = (mensagem) => {
        setLog(prev => [...prev, mensagem])
    }

    const acoes = {
        atacar: () => {
            modificarVida("vilao", 10)
            adicionarLog(`${heroi.nome} atacou ${vilao.nome} e causou 10 de dano`)
        },

        defender: () => {
            modificarVida("heroi", -5)
            adicionarLog(`${vilao.nome} atacou ${heroi.nome} e causou apenas 5 de dano`)
        },

        usarPocao: () => {
            modificarVida("heroi", 15)
            adicionarLog(`${heroi.nome} usou poção e regenerou 15 de vida`)
        },

        correr: () => {
            adicionarLog(`${heroi.nome} tentou fugir!`)
            alert("Fim de jogo!")
        }
    }
    const handlerAcaoHeroi = (acao) => {
        if (!turnoHeroi) return
        acoes[acao]?.()
        setTurnoHeroi(false)

        setTimeout( () => {

        })
    }
    return {
        heroi,
        vilao,
        log,
        turnoHeroi,
        handlerAcaoHeroi
    }
}