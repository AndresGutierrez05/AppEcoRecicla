import React, { Component } from 'react';
import { Row, Col,Popconfirm, message, Button } from 'antd';

class Menu extends Component{
    constructor(props){
        super(props);
        
    }

    confirm = (e) => {
        this.props.cerrarSesion()
    }

    render(){
        return(
            <Row className="menu-col">
                <Col span={16} className="menu-col-submenu col-middle"><h2 style={{ color : "white" }}>BIENVENIDO</h2></Col>
                <Popconfirm title="Desea cerrar sesion?" onConfirm={this.confirm} okText="Si" cancelText="No">
                        <Col span={4} className="menu-col-submenu col-middle"><Button type="primary">Cerrar session</Button></Col>
                </Popconfirm>
            </Row>
        )
    }
}

export default Menu;