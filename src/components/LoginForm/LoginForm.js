import './loginform.css'
import { useState } from "react";
import { Container, Form, Col, Row, Button, Alert } from "react-bootstrap";

function LoginForm(props) {

    const [email, setEmail] = useState('full@polito.it');
    const [password, setPassword] = useState('password');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage();
        let valid = true;
        
        //email validation
        if (email === '' || password === '' || 
            !email.includes('@') || !email.includes('.') || 
            email.includes('@.') || email.includes('.@') ||
            email.startsWith('@') || email.startsWith('.') ||
            email.endsWith('@') || email.endsWith('.')) {
                setErrorMessage("Email not valid.");
        } else {
            //login
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
                        <Form.Group  className="mb-3" controlId='email'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={email} onChange={(event) => {setEmail(event.target.value)}} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>
                        </Form.Group>
                        <Button type='submit' className='btn-primary mt-3 signin-btn' onClick={handleSubmit}>Sign in</Button>
                    </Form>
                    </Container>
                </Col>
            </Row>
    )
}

export default LoginForm;