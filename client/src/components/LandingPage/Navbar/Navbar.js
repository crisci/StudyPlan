import { Container, Form, Navbar } from "react-bootstrap";
import { FaUserGraduate } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";


function Nav(props) {
    const navigate = useNavigate();

    return (
        <Navbar bg="primary" variant="dark" className="navbar navbar-dark bg-primary fixed-top">
            <Container fluid style={{ paddingLeft: "1.2rem", paddingRight: "1.2rem" }}>
                <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate('/')}>
                    <FaUserGraduate className="mb-1" size='20px' />{' '}myPlan
                </Navbar.Brand>
                <Form onSubmit={event => event.preventDefault()}>
                    <Form.Control type="text" placeholder="Search"></Form.Control>
                </Form>
                <BsPersonCircle style={{ cursor: "pointer" }} color='white' size='30px' onClick={() => { props.user ? navigate('/user') : navigate('/login') }} />
            </Container>
        </Navbar >
    );
}

export default Nav;