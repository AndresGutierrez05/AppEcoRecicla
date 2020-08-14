import React, { Component } from 'react';
import Logeo from './Logeo';
import { Layout } from 'antd';
import Registro from './Registro';
import icono from '../Imagenes/icono.png';

const {
    Footer, Content
} = Layout;

class Inicio extends Component {

    constructor(props) {
        super(props);
        this.state = { accion: 1 }
    }

    cambiarModoInicio = (modo) => {
        this.setState({ accion: modo });
    }

    render() {
        return (
            <Layout>
                <Content className="content-style">
                    {this.state.accion === 1 ?
                        <Logeo cambiarmodo={(modo) => this.cambiarModoInicio(2)} />
                        : <Registro cambiarmodo={(modo) => this.cambiarModoInicio(1)} />}
                </Content>
                <Footer className="footer-style">
                    <img src={icono} style={{ width: "100px", height: "100px" }} />
                    <span style={{ color: "white"}}>App Ecorecicla ©2019</span>
                </Footer>
            </Layout>
        )
    }
}
export default Inicio;