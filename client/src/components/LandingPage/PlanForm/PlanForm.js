import { useState } from "react";
import { Form, Button, Row, Col, Container, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsXCircleFill } from "react-icons/bs";

function PlanForm(props) {



    const [currentCourse, setCurrentCourse] = useState(''); //form's value
    const [planType, setPlanType] = useState(); //0 full time, 1 part time
    const navigate = useNavigate();

    function validateCouse(codice) {
        // on Tot students, Incompatibilità and Propedeuticità or the same exam
        return true;
    }

    const handleAdd = (event) => {
        event.preventDefault();
        if (!validateCouse(currentCourse)) {
            return;
        } else {
            const current = props.courses.find(course => course.codice === currentCourse);
            props.addCourseToPlan(current);
            setCurrentCourse('');
        }
    }

    const handleCancel = () => {
        props.cancelCurrentPlan();
        if(props.add) {
            props.setAdd(false);
        } else {
            props.setEdit(false);
        }
        navigate('/');
    }

    const handleSave = () => {
        if(props.add) {
            props.setAdd(false);
        } else {
            props.setEdit(false);
        }
        props.saveCurrentPlan();
    }

    function handleX(codice, crediti) {
        props.deleteCourseFromPlan(codice, crediti);
    }


    return (
        <div>
            <p style={{ fontWeight: "600", fontSize: "3.5rem", margin: "0", paddingBottom:"10px" }}> {props.add ? "Add Plan" : "Edit Plan"}</p>
                <Row className="w-100 m-auto">
                    <Form className="d-flex justify-content-center mb-3">
                        <Form.Group className="d-flex me-3" onChange={() => setPlanType(0)}>
                            <Form.Label>Full Time</Form.Label>
                            <Form.Check type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                            </Form.Check>
                        </Form.Group>
                        <Form.Group className="d-flex ms-3" onChange={() => setPlanType(1)}>
                            <Form.Label>Part Time</Form.Label>
                            <Form.Check type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                            </Form.Check>
                        </Form.Group>
                    </Form>
                </Row>
            <Form onSubmit={handleAdd} className="d-flex m-auto mb-3">
                <Row className="justify-content-center w-100">
                    <Col className="col-md-4">
                        <Form.Group className="m-auto">
                            <Form.Control as="select" value={currentCourse} onChange={(event) => { setCurrentCourse(event.target.value) }} disabled={planType === undefined}>
                                <option hidden value=''>Select a course...</option>
                                {
                                    // Filter the entire list in order to select only the available courses based on currentPlan
                                    props.courses
                                        .filter(course => !props.currentPlan.find(p => p.codice === course.codice)) //filter film already added
                                        .filter(course => course.propedeuticita
                                            ? course.propedeuticita.split().some(codice => props.currentPlan.map(p => p.codice).includes(codice)) //true because at the beginning the currentPlan in empty
                                            : true)                                                                                             //when the courses will be added it returns false
                                        .filter(course => course.incompatibilita
                                            ? !course.incompatibilita.split("\n").some(codice => props.currentPlan.map(p => p.codice).includes(codice)) //return true if it found some incompatibility so !true
                                            : true)
                                        .filter(course => course.max_studenti ? course.tot_studenti < course.max_studenti : true)
                                        .map(course => <option key={course.codice} value={course.codice}>{course.titolo}</option>)
                                }
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col-md-1">
                        <Button className="m-auto w-75 text-center rounded-pill" type='submit' onClick={handleAdd} disabled={!currentCourse}> Add </Button>
                    </Col>
                </Row>
            </Form>
            {props.currentPlan.length ? <PlanList currentPlan={props.currentPlan} handleX={handleX} /> : false}
            <p>CFU: {props.currentCrediti}</p>
            <Row className="justify-content-center">
                <Col className="col-md-1"> <Button className="rounded-pill w-100" variant="danger" onClick={handleCancel}> Cancel </Button> </Col>
                <Col className="col-md-1"> <Button className="rounded-pill w-100" variant="success" onClick={handleSave} > Save </Button></Col>
            </Row>
        </div>
    )
}

function PlanList(props) {

    return (
        <ListGroup variant="flush" className="px-3">
            <ListGroup.Item key="title" as='li' className="d-flex justify-content-beetween list-titles">
                <Container>Codice</Container>
                <Container>Corso</Container>
                <Container>CFU</Container>
                <Container>Actions</Container>
            </ListGroup.Item>
            {
                props.currentPlan.map(course =>
                    <ListGroup.Item key={course.codice} as='li' className="d-flex justify-content-beetween mb-3 py-3">
                        <Container>{course.codice}</Container>
                        <Container>{course.titolo}</Container>
                        <Container>{course.crediti}</Container>
                        <Container ><BsXCircleFill style={{ cursor: "pointer" }} color="red" size="20px" onClick={() => props.handleX(course.codice, course.crediti)} /></Container>
                    </ListGroup.Item>)
            }
        </ListGroup>
    )
}

export default PlanForm;