import React, { Component } from 'react';
import { Form, Row, Select, Col, Icon, Input, Button, message } from 'antd';
import { RegisterUserInDataBase, firebasedb, RegisterUserInAuthentication } from '../FirebaseAdministrator';

const { Option } = Select;

class Registro extends Component{
    
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                let info = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    userTypeId: parseInt(values.userTypeId),
                    phone: parseInt(values.phone),
                    email: values.email
                }
                var password = values.password;
                let userRegister = await RegisterUserInAuthentication(info.email, password);
                if(userRegister.registerUser){
                    if(await RegisterUserInDataBase(info)){
                        message.success(userRegister.responseMessage);
                    }else{
                        message.warning(userRegister.responseMessage);  
                    }
                }else{
                    message.warning(userRegister.responseMessage);  
                }
            }
        });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Las dos contraseñas deben coincidir!');
        } else {
          callback();
        }
      }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render(){
        const { getFieldDecorator } = this.props.form;
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

        return(
            <div>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                        <center><h1>Registro</h1></center>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item label="Nombre">
                                {getFieldDecorator('firstName', {
                                    rules: [{ required: true, message: 'Por favor ingresar un nombre!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Nombre" />
                                )}
                            </Form.Item>
                            <Form.Item label="Apellido">
                                {getFieldDecorator('lastName', {
                                    rules: [{ required: true, message: 'Por favor ingresar un apellido!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Apellido" />
                                )}
                            </Form.Item>
                            <Form.Item label="Rol"> 
                                {getFieldDecorator('userTypeId', {
                                    rules: [{ required: true, message: 'Por favor ingresar el rol!' }],
                                })(
                                    <Select placeholder="Seleccione el rol">
                                        <Option value="1">Ciudadano</Option>
                                        <Option value="2">Reciclador</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="Correo">
                                {getFieldDecorator('email', {
                                    rules: [{ type: 'email', required: true, message: 'Ingrese un correo valido "Ejemplo@mail.com" !' }],
                                })(
                                    <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Correo" />
                                )}
                            </Form.Item>
                            <Form.Item label="Telefono">
                                {getFieldDecorator('phone', {
                                    rules: [{ required: true, message: 'Por favor ingresar el telefono!' }],
                                })(
                                    <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Telefono" />
                                )}
                            </Form.Item>
                            <Form.Item label="Contraseña">
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Por favor ingresar la contraseña!' }, {
                                        validator: this.validateToNextPassword,
                                      }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Contraseña" />
                                )}
                            </Form.Item>
                            <Form.Item label="Confirmar contraseña">
                                {getFieldDecorator('ConfirmarContrasena', {
                                    rules: [{ required: true, message: 'Por favor confirmar la contraseña!' }, {
                                        validator: this.compareToFirstPassword,
                                      }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" onBlur={this.handleConfirmBlur} placeholder="Confirmar contraseña" />
                                )}
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Registrarse
                                </Button>
                            </Form.Item>
                            <a onClick={this.props.cambiarmodo}> Iniciar Sessión!</a>
                        </Form>
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </div>
        )
    }
} 

export default Form.create()(Registro);
