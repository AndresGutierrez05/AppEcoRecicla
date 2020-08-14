import React, { Component } from 'react';
import moment from 'moment';
import { Form, message, Row, Col, Modal, TimePicker, Input, Button, Select, DatePicker} from 'antd';
import MyMenu from './MyMenu';
import { MapWithASearchBox, Localizacion } from './Mapa';
import ImagenReciclaje from '../Imagenes/58568a5b4f6ae202fedf2713.png';
import ServiciosEnEspera from './ServiciosEnEspera';
import { RegisterRequest, listObjects } from  '../FirebaseAdministrator';
import ConsultaSolicitudes from './ConsultaSolicitudes';

const Option = Select.Option, format = 'HH:mm', { TextArea } = Input;

class InicioCiudadano extends Component{
    constructor(props){
        super(props);
        this.state = { MostrarModalMapa : false,
                       InfoLocalizacion : null, 
                       listRecyclingObjects : [],
                       page : "0" }
    }

    GenerateNewRequest = dataForm => {
        const datos = {...dataForm, 
            deliveryDate : dataForm.deliveryDate.format("DD/MM/YYYY"),
            deliveryInitialTime : dataForm.deliveryInitialTime.format("HH:mm"),
            deliveryFinallyTime : dataForm.deliveryFinallyTime.format("HH:mm"),
            recyclingObjects : dataForm.recyclingObjects.map(item => parseInt(item)),
            citizenUserId : this.props.user.key, 
            stateRequest : 1, 
            historicRequest : null, 
            recyclingUserId : null,
            observations : dataForm.observations === undefined ? null : dataForm.observations };
        return datos;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values)  => {
            if (!err) {
                if(RegisterRequest(this.GenerateNewRequest(values))){
                        message.success("Solicitud ingresada correctamente");
                        this.props.form.resetFields();
                }else{
                    message.error("No se ha ingresado correctamente la solicitud, por favor vuelva a intentar");
                }
            }
        });

    }

    changePage = newPage => {
        this.setState({ page : newPage});
    }

    componentDidMount(){
        this.setState({ listRecyclingObjects : listObjects });
    } 

    showModal = () => {
        this.setState({
            MostrarModalMapa: true,
        });
    }
    
    handleOk = (e) => {
        this.setState({
            MostrarModalMapa: false,
            InfoLocalizacion : Localizacion
        });
    }

    validateInitialTime = (rule, value, callback) => {
        if(value > this.props.form.getFieldValue('deliveryFinallyTime')){
            callback('La hora inicial debe ser menor que la hora final!');
        }else{
            this.props.form.validateFields(['deliveryFinallyTime'], { force: true });
            callback();
        }
    }

    validateInitialTimeFromFinallyTime = (rule, value, callback) => {
        if(value < this.props.form.getFieldValue('deliveryInitialTime')){
            callback('La hora final debe ser mayor a la hora inicial!');
        }  
        else{
            this.props.form.validateFields(['deliveryInitialTime'], { force: true });
            callback();
        }
            
    }
    
    handleCancel = (e) => {
        this.setState({
            MostrarModalMapa: false,
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        let showContent;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
        };
        if(this.state.page === "0"){
            showContent = <div>
                            <Modal
                                title="Asignar Localización"
                                visible={this.state.MostrarModalMapa}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                >
                                    <MapWithASearchBox />
                            </Modal>
                            <Row>
                                <Col span={4}></Col>
                                <Col span={16} className="col-middle">
                                    <div style={{ width : "100%" }}>
                                        <center><h1>Solicitar servicio</h1></center>
                                        <center><img src={ImagenReciclaje} width="150px;" height="150px;" /></center>
                                        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                                            <Form.Item label="Fecha de entrega">
                                                {getFieldDecorator('deliveryDate', {
                                                    rules: [{ required: true, message: 'Por favor seleccione la fecha!' }]
                                                })(
                                                    <DatePicker disabledDate={(date) => date < moment().add("-1", "days")}/>
                                                )}
                                            </Form.Item>
                                            <Form.Item label="Hora inicial">
                                                {getFieldDecorator('deliveryInitialTime', {
                                                    rules: [{ required: true, message: 'Por favor seleccione una hora del intervalo inicial!' },
                                                            // { validator : this.validateInitialTime }],
                                                        ],
                                                    initialValue : moment('00:00', format)
                                                })(
                                                    <TimePicker format={format} />
                                                )}
                                            </Form.Item>
                                            <Form.Item label="Hora final">
                                                {getFieldDecorator('deliveryFinallyTime', {
                                                    rules: [{ required: true, message: 'Por favor seleccione una hora del intervalo final!' }, 
                                                            // { validator : this.validateInitialTimeFromFinallyTime }],
                                                        ],
                                                    initialValue : moment('00:00', format),
                                                })(
                                                    <TimePicker format={format}/>
                                                )}
                                            </Form.Item>
                                            <Form.Item label="Direccion">
                                                {getFieldDecorator('direction', {
                                                    rules: [{ required: true, message: 'Debe existir una dirección!'}],
                                                    initialValue : this.state.InfoLocalizacion === null ? "" : this.state.InfoLocalizacion.Direccion
                                                })(
                                                    <Input placeholder="Direccion" disabled />
                                                )}   
                                            </Form.Item>
                                            <Form.Item label="Latitud">
                                                {getFieldDecorator('latitude', {
                                                    rules: [{ required: true, message: 'Debe existir una latitud!' }],
                                                    initialValue : this.state.InfoLocalizacion === null ? "" : this.state.InfoLocalizacion.LatLng.Latitud
                                                })(
                                                    <Input placeholder="Latitud" disabled />
                                                )}
                                            </Form.Item>
                                            <Form.Item label="Longitud">
                                                {getFieldDecorator('longitude', {
                                                    rules: [{ required: true, message: 'Debe existir una longitud!' }],
                                                    initialValue : this.state.InfoLocalizacion === null ? "" : this.state.InfoLocalizacion.LatLng.Longitud
                                                })(
                                                    <Input placeholder="Longitud" disabled />
                                                )}
                                            </Form.Item>
                                            <Form.Item {...tailFormItemLayout}>
                                                <Button type="dashed" onClick={this.showModal}>Asignar localización</Button>
                                            </Form.Item>
                                            <Form.Item label="Productos a reciclar">
                                                {getFieldDecorator('recyclingObjects', {
                                                    rules: [{ required: true, message: 'Por favor seleccione almenos un tipo de producto!' }],
                                                })(
                                                    <Select
                                                        mode="multiple"
                                                        size="default"
                                                        placeholder="Por favor seleccione uno o varios tipos de producto"
                                                        style={{ width: '100%' }}
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                    {
                                                        this.state.listRecyclingObjects.map(recyclingObject => 
                                                        <Option key={recyclingObject.name}  value={recyclingObject.recyclingObjectId}  >{recyclingObject.name}</Option>
                                                    )}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                            <Form.Item label="Observaciones">
                                                {getFieldDecorator('observations')(
                                                    <TextArea rows={4} maxLength="250"/>
                                                )}
                                            </Form.Item>
                                            <Form.Item {...tailFormItemLayout}>
                                                <Button type="primary" htmlType="submit" className="login-form-button">
                                                    Solicitar Servicio
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        <hr></hr>
                                        <ServiciosEnEspera sesionType={1} user={this.props.user}/>
                                    </div>
                                </Col>
                                <Col span={4}></Col>
                            </Row>
                        </div>
        }else if(this.state.page === "1"){
            showContent = <ConsultaSolicitudes user={this.props.user}/>
        }
        return(
            <div>
                <MyMenu cerrarSesion={this.props.cerrarSesion} sesionType={1} changePage={this.changePage}/>
                {showContent}
            </div>
        )
    }
}

export default Form.create()(InicioCiudadano);