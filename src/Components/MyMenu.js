import React, { Component } from 'react';
import { Row, Col, Popconfirm, Modal, Menu, Button, Icon, Popover } from 'antd';
import icono from '../Imagenes/icono.png';

const SubMenu = Menu.SubMenu;

class MyMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            visible : false
        }
    }

    handleClick = (e) => {
        if(e.key != "cerrar")
            this.props.changePage(e.key);
    }
    
    showModal = () => {
        this.setState({
          visible: true,
        });
    }
    
    hideModal = () => {
        this.setState({
          visible: false,
        });
    }

    closeSesion = () =>{
        this.hideModal();
        this.props.cerrarSesion();
    }

    render(){
        return( 
            <Row className="" style={{ backgroundColor : "#145A32"}}>
                <Col span={6} style={{ height : "48px"}}>
                        <Menu
                        onClick={this.handleClick}
                        mode="horizontal"
                        style={{backgroundColor : "#145A32"}}
                        theme="light"
                        >
                            <SubMenu title={<span style={{ color : "white"}}><Icon type="menu-unfold" style={{ color: "white"}}/>Menú</span>}>
                                <Menu.Item key="0">Inicio</Menu.Item>
                                <Menu.Item key="1">{this.props.sesionType === 1 ? "Consultar servicios" : "Servicios sin asignar"}</Menu.Item>
                                <Menu.Item key="cerrar">
                                    <Button type="primary" onClick={this.showModal}>Cerrar Sesión</Button>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>  
                    </Col>
                    <Col span={12} style={{ height : "48px"}}>
                       <div style={{ textAlign: "center" , height : "100%"}}>
                            <span style={{ color : "white" , height : "100%", lineHeight : "48px", fontSize : "20px" }}>BIENVENIDO</span>
                       </div>
                    </Col>
                    <Col span={6} style={{ height : "48px"}}> 
                        <div style={{ display : "flex", width : "100%", justifyContent: "flex-end"}}>
                            <img src={icono} style={{ width : "32px", height : "32px", marginTop: "5px"}} />
                        </div>
                    </Col>
                    <Modal
                                        title=""
                                        visible={this.state.visible}
                                        onOk={this.closeSesion}
                                        onCancel={this.hideModal}
                                        okText="Cerrar"
                                        cancelText="Cancelar"
                                    >
                                        Desea cerrar sesión?
                                    </Modal>
                </Row>
        )
    }
}

export default MyMenu;