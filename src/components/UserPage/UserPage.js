import './userpage.css'
import { Container, Col, Row, Button, Form } from "react-bootstrap";

function UserPage(props) {

    return (
        <Row className="vh-100 m-0 login-background">
            <Col className="m-auto pb-5">
                <Container className='login-form'>
                    <h1 className="text-center mb-3">Profile</h1>
                    <Form>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="email" value={props.nome} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control type="email" value={props.cognome} disabled />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={props.email} disabled />
                        </Form.Group>

                        <Button variant='danger' className='btn w-100 logout-btn'>Log out</Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    )
}

export default UserPage;