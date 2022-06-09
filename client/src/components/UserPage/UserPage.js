import './userpage.css'
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function UserPage(props) {

    const navigate = useNavigate();


    function handleLogout() {
        props.logout();
    }

    return (
        <Row className="vh-100 m-0 login-background">
            <Col className="m-auto pb-5">
                <Container className='login-form'>
                    <h1 className="text-center mb-3">Profile</h1>
                    <Form>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="email" value={props.user.nome} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="email" value={props.user.cognome} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={props.user.username} disabled />
                        </Form.Group>

                    </Form>
                    <Button variant='primary' className='btn w-50 logout-btn w-50' onClick={() => {navigate('/')}}>Home</Button>
                    <Button variant='danger' className='btn w-50 logout-btn' onClick={() => handleLogout()}>Log out</Button>
                </Container>
            </Col>
        </Row>
    )
}

export default UserPage;