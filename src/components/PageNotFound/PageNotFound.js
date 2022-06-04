import { Col, Row, Button } from "react-bootstrap";
import "./pagenotfound.css";
import image from './404error.png';
import { useNavigate } from "react-router-dom";

function PageNotFound() {

    const navigate = useNavigate();

    return (
        <Row className="vh-100 m-0 main">
            <Col md={7} className="m-auto message">
                <Row><h1>Oops!</h1></Row>
                <Row><h3 style={{marginTop:"2rem"}}>We can't seem to find the page you're looking for.</h3></Row>
                <Row><p>Error code: 404</p></Row>
                <Button className='btn-primary nf-button' onClick={() => {navigate('/')}}>Go Home</Button>
            </Col>
            <Col md={5} className="m-auto">
                <img src={image} alt="Image" />
            </Col>
        </Row>
    )
}

export default PageNotFound;