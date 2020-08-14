import React, { Component } from 'react';
import { Form, Row, Col, Icon, Input, Button, Checkbox, message } from 'antd';
import InicioCiudadano from './InicioCiudadano';
import InicioReciclador from './InicioReciclador';
import { LoginInAuthentication, GetUserInDatabase } from '../FirebaseAdministrator';

class Logeo extends Component {
    constructor(props) {
        super(props);
        this.state = { logeado: false, user: null }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let info = {
                    email: values.email,
                    password: values.password
                }
                let userLogin = await LoginInAuthentication(info.email, info.password);
                if(userLogin){
                    GetUserInDatabase(info.email, value => this.setState({ user: value, logeado: true }));
                }else{
                    message.warning("Correo o contraseña incorrecta");
                }
            }else{
                message.warning("Debe ingresar todos los campos correctamente");
            }
        });
    }

    cerrarSesion = () => {
        this.setState({ logeado: false });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {this.state.logeado ?
                    this.state.user.userTypeId == 2 ?
                        <InicioReciclador cerrarSesion={_ => this.cerrarSesion()} user={this.state.user} />
                        :
                        <InicioCiudadano cerrarSesion={_ => this.cerrarSesion()} user={this.state.user} />
                    :
                    <Row>
                        <Col span={2}></Col>
                        <Col span={20}>
                            <h1>Iniciar Sesión</h1>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('email', {
                                        rules: [{ type: 'email', required: true, message: 'Ingrese un correo valido "Ejemplo@mail.com" !' }],
                                    })(
                                        <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Correo" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Por favor ingresar la contraseña!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Iniciar
                            </Button>
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('remember', {
                                        valuePropName: 'checked',
                                        initialValue: true,
                                    })(
                                        <Checkbox>Recordar me</Checkbox>
                                    )}
                                    <a className="login-form-forgot" href="">Olvide mi contraseña, </a>
                                </Form.Item>
                                <a onClick={this.props.cambiarmodo}> Registrarse!</a>
                            </Form>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                }

            </div>
        );
    }
}

export default Form.create()(Logeo);