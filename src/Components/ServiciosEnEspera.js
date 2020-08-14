import React, { Component } from 'react';
import { Table, Popconfirm, Tag, Modal, Icon, message } from 'antd';
import { componentWillUnmount } from 'react-google-maps/lib/utils/MapChildHelper';
import { GetListRequestsOnHoldByCitizenUser, GetListRequestsOnHold, assignRequest } from '../FirebaseAdministrator';
import { MapWithAMarkerWithLabel } from './Mapa';
import { Button } from 'antd/lib/radio';
import { GetColorTag } from '../Helpers';

let columns = [];

class ServiciosEnEspera extends Component{
    constructor(props){
        super(props);
        this.state = {
            listServicesOnHold : [],
            visible : false,
            mapRequestSelelected :  null
        }
    }
    
    showModal = key => {
        this.setState({
          visible: true,
          mapRequestSelelected : this.state.listServicesOnHold.filter(request => request.key === key)[0]
        });
    }

    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
    }

    confirm = text => {
        if(assignRequest(text, this.props.user.key)){
            message.success("Se ha asignado correctamente la solicitud");
        }else{
            message.warning("No se asignó correctamente, por favor vuelva a intentar");
        }
    }
    async componentWillMount(){
        if(this.props.sesionType === 1){
            columns = [{
                title: 'Fecha entrega',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
              }, {
                title: 'Hora Inicial',
                dataIndex: 'deliveryInitialTime',
                key: 'deliveryInitialTime',
              }, {
                title: 'Hora Final',
                dataIndex: 'deliveryFinallyTime',
                key: 'deliveryFinallyTime',
              },{
                title: 'Direccion',
                dataIndex: 'direction',
                key: 'direction',
              }];

            await GetListRequestsOnHoldByCitizenUser(this.props.user.key, (value) => this.setState({listServicesOnHold : value}));
        }else if(this.props.sesionType === 2){
            columns = [{
                title: 'Fecha entrega',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
              }, {
                title: 'Hora Inicial',
                dataIndex: 'deliveryInitialTime',
                key: 'deliveryInitialTime',
              }, {
                title: 'Hora Final',
                dataIndex: 'deliveryFinallyTime',
                key: 'deliveryFinallyTime',
              },{
                title: 'Objetos',
                dataIndex: 'recyclingObjects',
                key: 'recyclingObjects',
                render : objects => 
                    <span>
                      {objects.map((object, index) => {
                            return <Tag key={index} color={GetColorTag(object)}>{object}</Tag>;
                        })
                      }
                    </span>
            },
            {
                title: 'Observaciones',
                dataIndex: 'observations',
                key: 'observations',
            },
            {
                title: 'Ver mapa',
                dataIndex: 'key',
                key: 'y',
                render : key =>
                    <a onClick={() => this.showModal(key)}><Icon type="environment" theme="filled" /></a>
            },
            {
                title: 'Asignar',
                dataIndex: "key",
                key: 'x',
                render : key => 
                     <Popconfirm title="Deseas asignarte esta solicitud?" onConfirm={() => this.confirm(key)} okText="Si" cancelText="No">
                                <a href="javascript:;">Asignarse solicitud</a>
                     </Popconfirm>
            }];
            await GetListRequestsOnHold((value) => this.setState({listServicesOnHold : value}));
        }
    }

    render(){
        return(
            <div>
                {this.state.listServicesOnHold.length > 0 ?
                    <div>
                        <center><h2>Solicitudes en espera</h2></center>
                        <div style={{ overflowX : "auto", width : "100%" }}>
                            <Table dataSource={this.state.listServicesOnHold} columns={columns} />       
                            <Modal
                                title="Mapa"
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                footer={null}
                                >
                                {this.state.mapRequestSelelected != null ? 
                                    <MapWithAMarkerWithLabel lat={this.state.mapRequestSelelected.latitude} lng={this.state.mapRequestSelelected.longitude} direction={this.state.mapRequestSelelected.direction}/>
                                : ""}
                                
                            </Modal>
                        </div>
                    </div>
                : <center><h3>No hay solicitudes en espera</h3></center> }
            </div>
        )
    }
}

export default ServiciosEnEspera;