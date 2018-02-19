import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

class EventoCabecalho extends Component{
    state={
        estaAberto: false
    }

    obterClasseLutas = () => this.state.estaAberto ? "lutasAbertas" : "lutasFechadas";

    clicouCabecalho = () => this.setState(prevState => ({estaAberto: !prevState.estaAberto}))

    render(){

        return (
            <div className="evento">
                <div className="eventoCabecalho" onClick={this.clicouCabecalho}>
                    <div className="eventoCabecalhoData">{this.props.dataEvento}</div>
                    <h1 className="eventoCabecalhoTitulo">{this.props.tituloEvento} </h1>
                    <FontAwesome className="EventoCabecalhoIcon" size="2x" name={this.state.estaAberto ? "angle-up" : "angle-down" } />
                </div>
                <div className="areaLutas" style={this.state.estaAberto ? {height: this.props.totalLutas * 85 + 4 } : {height: '0px'}}>
                        {this.props.lutas}
                </div>
            </div>
            )
    }
}

export default EventoCabecalho;