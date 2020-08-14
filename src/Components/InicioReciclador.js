import React, { Component } from 'react';
import { Calendar, Modal, Row, Col, Tag, Card, Select, Button, Popconfirm, message } from 'antd';
import MyMenu from './MyMenu';
import ServiciosEnEspera from './ServiciosEnEspera';
import { GetListRequestsAssignedByRecyclingUser, statesRequests, updateStateRequest } from '../FirebaseAdministrator';
import { MapWithAMarkerWithLabel } from './Mapa';
import { GetColorTag, GetColorState } from '../Helpers';

const gridStyle = {
    width: "33.3%",
    textAlign: "center",
    height: "100%"
};

class InicioReciclador extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "0",
            listRequestsAssigned: [],
            requestSelelected: null,
            visible: false,
            newStateRequest: null
        }
    }

    onPanelChange = (value, mode) => {
    }

    changePage = newPage => {
        this.setState({ page: newPage });
    }

    handleChange = value => {
        this.setState({
            newStateRequest: value
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false
        });
    }


    MoreInfo = key => {
        let selected = this.state.listRequestsAssigned.filter(request => request.key === key)[0];
        this.setState({ requestSelelected: selected, visible: true, newStateRequest: selected.stateRequest });
    }

    async componentDidMount() {
        await GetListRequestsAssignedByRecyclingUser(this.props.user.key, (value) => this.setState({ listRequestsAssigned: value }));
    }

    dateCellRenderRequestAssigned = moment => {
        return (
            this.state.listRequestsAssigned.filter(request => request.deliveryDate === moment.format("DD/MM/YYYY")).map((request, index) =>
                <Tag key={index} color={GetColorState(request.stateRequest)} onClick={() => this.MoreInfo(request.key)}><li>{request.direction}</li></Tag>
            )
        )
    }

    onChange = e => {
    }

    changeStateRequest = _ => {
        if (this.state.requestSelelected.stateRequest !== this.state.newStateRequest) {
            if (updateStateRequest(this.state.requestSelelected.key, this.state.newStateRequest)) {
                message.success("Se ha actualizado correctamente el estado de la solicitud");
                this.setState({ visible: false });
            } else {
                message.warning("Ha habido un error al actualizar el estado de la solicitud, por favor vuelva a intentar");
            }
        } else {
            message.warning("Debe modificar el estado de la solicitud");
        }
    }

    render() {
        let showContent;
        if (this.state.page === "0") {
            showContent = <div>
                <Row>
                    <Col span={4}></Col>
                    <Col span={16} className="col-middle">
                        <div style={{ width: "100%" }}>
                            <center><h1>Mis Asignaciones</h1></center>
                            <Calendar dateCellRender={this.dateCellRenderRequestAssigned} onPanelChange={this.onPanelChange} onChange={this.onChange} />
                        </div>
                    </Col>
                    <Col span={4}></Col>
                    {this.state.requestSelelected != null ?
                        <Modal
                            title="Información de la solicitud"
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            footer={null}
                        >
                            <div>
                                <MapWithAMarkerWithLabel height="200px" lat={this.state.requestSelelected.latitude} lng={this.state.requestSelelected.longitude} direction={this.state.requestSelelected.direction} />
                                <Card title="Información de ciudadano">
                                    <Card.Grid >Nombre : {`${this.state.requestSelelected.infoCitizen.firstName} ${this.state.requestSelelected.infoCitizen.lastName}`}</Card.Grid>
                                    <Card.Grid >Telefono : {this.state.requestSelelected.infoCitizen.phone}</Card.Grid>
                                    <Card.Grid >Correo : {this.state.requestSelelected.infoCitizen.email}</Card.Grid>
                                </Card>
                                <Card title="Información de la solicitud">
                                    <Card.Grid style={gridStyle}>Fecha : {this.state.requestSelelected.deliveryDate}</Card.Grid>
                                    <Card.Grid style={gridStyle}>Hora inicial : {this.state.requestSelelected.deliveryInitialTime}</Card.Grid>
                                    <Card.Grid style={gridStyle}>Hora Final : {this.state.requestSelelected.deliveryFinallyTime}</Card.Grid>
                                    <Card.Grid style={{ width: "100%" }}>Objetos : {this.state.requestSelelected.recyclingObjects.map((object, index) =>
                                        <Tag key={index} color={GetColorTag(object)}>{object}</Tag>
                                    )}</Card.Grid>
                                    <Card.Grid style={{ width: "100%" }}>Observaciones : {this.state.requestSelelected.observations}</Card.Grid>
                                    <Card.Grid style={{ width: "100%" }}>Cambiar estado :
                                    <Select value={this.state.requestSelelected.stateRequest === this.state.newStateRequest ? this.state.requestSelelected.stateRequest : this.state.newStateRequest} style={{ width: 120 }} onChange={this.handleChange}>
                                            {statesRequests.filter(stateRequest => stateRequest.stateRequestId !== 1).map(stateRequest =>
                                                <Select.Option selected key={stateRequest.stateRequestId} value={stateRequest.stateRequestId}>{stateRequest.name}</Select.Option>
                                            )}
                                        </Select>
                                        <Popconfirm placement="topLeft" title="Desea actualizar estado de la solicitud" onConfirm={this.changeStateRequest} okText="Si" cancelText="No">
                                            <Button type="primary">Actualizar</Button>
                                        </Popconfirm>
                                    </Card.Grid>
                                </Card>
                            </div>
                        </Modal> : ""}

                </Row>
            </div>;
        } else if (this.state.page === "1") {
            showContent = <ServiciosEnEspera sesionType={2} user={this.props.user} />
        }

        return (
            <div>
                <MyMenu cerrarSesion={this.props.cerrarSesion} sesionType={2} changePage={this.changePage} />
                {showContent}
            </div>
        )
    }
}

export default InicioReciclador;