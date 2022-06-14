import './loginform.css'
import { useState } from "react";
import { Container, Form, Col, Row, Button, Alert } from "react-bootstrap";

function LoginForm(props) {

    const [username, setUsername] = useState('full@polito.it');
    const [password, setPassword] = useState('password');
    const [errorMessage, setErrorMessage] = useState("");

    const usernameValidation = (username) => {
        return String(username)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage();
        //username validation
        if (!usernameValidation(username)) {
            setErrorMessage("username not valid.");
        } else if (password.trim() === '') {
            setErrorMessage('Password is mandatory.')
        } else {
            //login
            props.login({ username, password }).catch(err => {setErrorMessage(err.message)});
        }
    }

    return (
        <Row className="vh-100 m-0 login-background">
            <Col className="m-auto pb-5">
                <Container className='login-form'>
                    <h1 className="text-center mb-4">Login</h1>
                    {errorMessage
                        ? <Alert variant='danger' onClose={() => setErrorMessage()} dismissible>
                            <Alert.Heading>Something went wrong!</Alert.Heading>
                            {errorMessage}
                        </Alert>
                        : ''}
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId='username'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="username" value={username} onChange={(event) => { setUsername(event.target.value) }} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(event) => { setPassword(event.target.value) }} />
                        </Form.Group>
                        <Button type='submit' className='btn-primary mt-3 signin-btn' onClick={handleSubmit}>Sign in</Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    )
}

export default LoginForm;