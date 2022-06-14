import { Container, Navbar } from "react-bootstrap";
import { FaUserGraduate } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";


function Nav(props) {
    const navigate = useNavigate();

    return (
        <Navbar bg="primary" variant="dark" className="navbar navbar-dark bg-primary fixed-top">
            <Container fluid style={{ paddingLeft: "1.2rem", paddingRight: "1.2rem" }}>
                <Navbar.Brand >
                    <FaUserGraduate className="mb-1" size='20px' />{' '}myPlan
                </Navbar.Brand>
                <BsPersonCircle style={{ cursor: "pointer" }} color='white' size='30px' onClick={() => { props.user?.id ? props.navigateToUserPage() : navigate('/login') }} />
            </Container>
        </Navbar >
    );
}

export default Nav;