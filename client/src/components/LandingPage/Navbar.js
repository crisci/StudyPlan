import { Button, Container, Navbar } from "react-bootstrap";
import { FaUserGraduate } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";


function Nav(props) {
    const navigate = useNavigate();

    function handleLogout() {
        props.doLogOut();
    }

    return (
        <Navbar bg="primary" variant="dark" className="navbar navbar-dark bg-primary fixed-top">
            <Container fluid style={{ paddingLeft: "1.2rem", paddingRight: "1.2rem" }}>
                <Navbar.Brand >
                    <FaUserGraduate className="mb-1" size='20px' />{' '}myPlan
                </Navbar.Brand>
                <Button variant={props.user?.id ? "danger" :"light"} size='30px' className="rounded-pill" onClick={() => { props.user?.id ? handleLogout() : navigate('/login') }}>
                    {
                        props.user?.id ? "Logout" : "Login"
                    }
                </Button>
            </Container>
        </Navbar >
    );
}

export default Nav;