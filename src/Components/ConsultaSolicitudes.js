import React, { Component } from 'react';
import { Table, Popconfirm, Tag, Modal, Icon, Card } from 'antd';
import { MapWithAMarkerWithLabel } from './Mapa';
import { GetListUserRequests } from '../FirebaseAdministrator';
import { GetColorState, GetNameState, GetColorTag } from '../Helpers';

const gridStyle = {
    width: "33.3%",
    textAlign: "center",
    height: "100%"
};

class ConsultaSolicitudes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRequest: [],
            visible: false,
            requestSelected: null
        }
    }

    async componentWillMount() {
        await GetListUserRequests(this.props.user.key, (value) => this.setState({ listRequest: value }));
    }

    showModal = key => {
        this.setState({ requestSelected: this.state.listRequest.filter(request => request.key === key)[0], visible: true });
    }

    handleCancel = e => {
        this.setState({ visible: false });
    }

    render() {
        const columns = [{
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
        }, {
            title: 'Direccion',
            dataIndex: 'direction',
            key: 'direction',
        }, {
            title: 'Estado de la solicitud',
            dataIndex: 'stateRequest',
            key: 'stateRequest',
            render: state => <Tag color={GetColorState(state)}>{GetNameState(state)}</Tag>
        }, {
            title: 'Observaciones',
            dataIndex: 'observations',
            key: 'observations',
        }, {
            title: 'Ver mapa',
            dataIndex: 'key',
            key: 'y',
            render: key =>
                <a onClick={() => this.showModal(key)}><Icon type="environment" theme="filled" /></a>
        },
        ];

        return (
            <div>
                {this.state.listRequest.length > 0 ?
                    <div>
                        <center><h2>Mis solicitudes</h2></center>
                        <div style={{ overflowX: "auto", width: "100%" }}>
                            <Table dataSource={this.state.listRequest} columns={columns} />
                            <Modal
                                title="Mapa"
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                footer={null}
                            >
                                {this.state.requestSelected != null ?
                                    <div>
                                        <MapWithAMarkerWithLabel lat={this.state.requestSelected.latitude} lng={this.state.requestSelected.longitude} direction={this.state.requestSelected.direction} />
                                        {this.state.requestSelected.stateRequest > 1 ?
                                            <div>
                                                <Card title="Información del reciclador">
                                                    <Card.Grid >Nombre : {`${this.state.requestSelected.infoRecycling.firstName} ${this.state.requestSelected.infoRecycling.lastName}`}</Card.Grid>
                                                    <Card.Grid >Telefono : {this.state.requestSelected.infoRecycling.phone}</Card.Grid>
                                                    <Card.Grid >Correo : {this.state.requestSelected.infoRecycling.email}</Card.Grid>
                                                </Card>
                                                <Card title="Información de la solicitud">
                                                    <Card.Grid style={gridStyle}>Fecha : {this.state.requestSelected.deliveryDate}</Card.Grid>
                                                    <Card.Grid style={gridStyle}>Hora inicial : {this.state.requestSelected.deliveryInitialTime}</Card.Grid>
                                                    <Card.Grid style={gridStyle}>Hora Final : {this.state.requestSelected.deliveryFinallyTime}</Card.Grid>
                                                    <Card.Grid style={{ width: "100%" }}>Objetos : {this.state.requestSelected.recyclingObjects.map((object, index) =>
                                                        <Tag key={index} color={GetColorTag(object)}>{object}</Tag>
                                                    )}</Card.Grid>
                                                    <Card.Grid style={{ width: "100%" }}>Observaciones : {this.state.requestSelected.observations}</Card.Grid>
                                                </Card>
                                            </div>
                                            : ""}
                                    </div>
                                    : ""}
                            </Modal>
                        </div>
                    </div>
                    : <center><h3>Sin solicitudes realizadas</h3></center>}
            </div>
        )
    }
}

export default ConsultaSolicitudes;