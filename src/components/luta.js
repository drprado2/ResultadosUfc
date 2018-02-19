import React, { Component } from 'react'

function obterClasseTexto(resultadoLutador){
    return resultadoLutador === "Venceu" ? "textoWin" : "textoLose"
}

function obterClasseLutador(resultadoLutador){
    return resultadoLutador === "Venceu" ? "win" : "lose"
}

const Luta = props =>
    <div className="luta" >
        <div className="lutaTitulo">{props.tituloLuta}</div>
        <div className="lutadores">
            <div className={`lutador ${obterClasseLutador(props.resultadoLutadorA)}`}>{props.lutadorA}<span className={obterClasseTexto(props.resultadoLutadorA)}>{props.resultadoLutadorA}</span></div>
            <div className={`lutador ${obterClasseLutador(props.resultadoLutadorB)}`}>{props.lutadorB}<span className={obterClasseTexto(props.resultadoLutadorB)}>{props.resultadoLutadorB}</span></div>
        </div>
    </div>

export default Luta;