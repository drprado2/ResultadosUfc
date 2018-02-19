import React, { Component } from 'react';
import './App.css';
import Container from './components/container'
import EventoCabecalho from './components/eventoCabecalho'
import Luta from './components/luta'

const idEventoInicial = 652;
const idEventoFinal = 852;

class App extends Component {
    state={
        erros: [],
        eventos: []
    }

    buscarDadosUfc = async idEvento => {
        try{
            const eventoJaArmazenado = this.obterEventoJaArmazenado(idEvento);
            if(eventoJaArmazenado)
                return eventoJaArmazenado;

            const response = await fetch(this.obterRequisicaoParaEvento(idEvento));
            if(!response.ok){
                const eventoErro = { sucess: false, evento: null, erro: { idEvento, erro: response.statusText } }
                this.armazenarEvento(idEvento, eventoErro)
            }

            const evento = await response.json();
            const eventoFormatado = this.montarEstruturaEvento(evento);
            this.armazenarEvento(idEvento, eventoFormatado);
            return eventoFormatado;
        }catch(erro){
            const eventoErro = { sucess: false, evento: null, erro: { idEvento, erro } };
            this.armazenarEvento(idEvento, eventoErro);
            return eventoErro;
        }
    }

    componentDidMount(){
        this.buscarDadosTodosUfcs()
    }

    armazenarEvento = (idEvento, evento) => localStorage.setItem(idEvento, JSON.stringify(evento))

    obterEventoJaArmazenado = idEvento => JSON.parse(localStorage.getItem(idEvento))

    obterRequisicaoParaEvento = idEvento => new Request(`http://localhost:8080/http://m.ufc.com.br/fm/api/event/detail/${idEvento}.json`, {  method: 'GET', redirect: 'follow'})

    buscarDadosTodosUfcs = async () => {
        console.log(`Começou a buscar os eventos UFC: ${new Date()}`)
        const eventos = await Promise.all(this.obterRequisicoesEventos())
        const eventosSemErro = eventos.filter(evento => evento.sucess).map(evento => evento.evento)
        const erros = eventos.filter(evento => !evento.sucess).map(evento => evento.erro)
        this.setState({eventos: eventosSemErro, erros })
        console.log(`Terminou de buscar todos os eventos UFC: ${new Date()}`)
    }

    obterRequisicoesEventos = () => {
        const requisicoes = [];
        for(let idEvento = idEventoInicial; idEvento <= idEventoFinal; idEvento++) {
            requisicoes.push(this.buscarDadosUfc(idEvento));
        }
        return requisicoes;
    }

    montarEstruturaEvento = evento => {
        const eventoFormatado = {
            ufc: evento.Name,
            dataEvento: this.obterDataFormatada(evento.Date),
            eventoId: evento.statid,
            lutas: this.montarEstruturaLutas(evento.FightCard)
        }

        return {
            sucess: true,
            evento: eventoFormatado,
            erro: null
        }
    }

    obterDataFormatada = data =>
        data.split('-').reverse().reduce((anterior, atual) => anterior ? `${anterior}\\${atual}` : `${atual}`);

    montarEstruturaLutas = lutas => {
        return lutas.map(luta => ({
            luta: this.montarTituloLuta(luta.Fighters),
            lutadores: luta.Fighters.map(lutador => ({
                lutador: `${lutador.Name.FirstName} ${lutador.Name.LastName}`,
                resultado: lutador.Outcome.Outcome === "Loss"
                    ? "Perdeu"
                    : lutador.Outcome.Outcome === "Win" ? "Venceu" : "Empatou"
            }))
        }))
    }

    montarTituloLuta = lutadores =>
        lutadores.reduce((anterior, atual, idx) =>
            idx === 1
                ? `${anterior.Name.FirstName} ${anterior.Name.LastName} VS ${atual.Name.FirstName} ${atual.Name.LastName}`
                : ""
        )

    obterLutasDoEvento = evento =>
        <div>
            {evento.lutas.map(luta => <Luta
                tituloLuta={luta.luta}
                lutadorA={luta.lutadores[0].lutador}
                lutadorB={luta.lutadores[1].lutador}
                resultadoLutadorA={luta.lutadores[0].resultado}
                resultadoLutadorB={luta.lutadores[1].resultado}
            />)}
        </div>

  render() {
    return (
      <div className="App">
          {this.state.eventos.length == 0
              ? <h1 style={{textAlign: 'center'}}>Carregando...</h1>
              : <Container>
                  {this.state.eventos.map(e =>
                      <EventoCabecalho key={e.eventoId} totalLutas={e.lutas.length} lutas={this.obterLutasDoEvento(e)} dataEvento={e.dataEvento} tituloEvento={e.ufc} />
                  )}
              </Container>
          }
      </div>
    );
  }
}

export default App;
