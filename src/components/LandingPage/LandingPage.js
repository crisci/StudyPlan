import { Container, Row, Col } from "react-bootstrap";
import CourseList from "./CourseList/CourseList";
import Nav from "./Navbar/Navbar";

function LandingPage(props) {
    return(
        <>
        <Nav/>
        <CourseList user={props.user}/>
        </>
    )
}

export default LandingPage;