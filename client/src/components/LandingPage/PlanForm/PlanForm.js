import { useState } from "react";
import { Form, Button, Row, Col, Container, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsXCircleFill } from "react-icons/bs";

function PlanForm(props) {



    const [currentPlan, setCurrentPlan] = useState([]); //used for the visualization
    const [currentCourse, setCurrentCourse] = useState(''); //form's value
    const [currentCFU, setCurrentCFU] = useState(0);
    const navigate = useNavigate();

    console.log(currentPlan);

    function validateCouse(codice) {
        // on Tot students, Incompatibilità and Propedeuticità or the same exam
        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateCouse(currentCourse)) {
            return;
        } else {
            const current = props.courses.find(course => course.codice === currentCourse);
            setCurrentPlan(oldCurrentPlan => ([...oldCurrentPlan, current]));
            setCurrentCourse('');
            setCurrentCFU(oldCurrentCFU => oldCurrentCFU + current.crediti);
        }
    }

    const handleCancel = () => {
        props.cancelPlan();
        navigate('/');
    }

    function handleX (codice, crediti) {
        setCurrentPlan(currentPlan.filter(p => p.codice !== codice));
        setCurrentCFU(oldCurrentCFU => oldCurrentCFU - crediti);
    }

    return (
        <div>
            <h2>Add Plan</h2>
            <Form onSubmit={handleSubmit} className="d-flex m-auto mb-3" >
                <Row className="justify-content-center w-100">
                    <Col className="col-md-4">
                        <Form.Group className="m-auto">
                            <Form.Control as="select" value={currentCourse} onChange={(event) => { setCurrentCourse(event.target.value) }}>
                                <option hidden value=''>Select a course...</option>
                                {
                                    // Filter the entire list in order to select only the available courses based on currentPlan
                                    props.courses
                                        .filter(course => !currentPlan.find(p => p.codice === course.codice)) //filter film already added
                                        .filter(course => course.propedeuticita
                                            ? course.propedeuticita.split(" ").some(codice => currentPlan.map(p => p.codice).includes(codice)) //true because at the beginning the currentPlan in empty
                                            : true)                                                                                             //when the courses will be added it returns false
                                        .filter(course => course.incompatibilita
                                            ? !course.incompatibilita.split("\n").some(codice => currentPlan.map(p => p.codice).includes(codice)) //return true if it found some incompatibility so !true
                                            : true)
                                        .filter(course => course.max_studenti ? course.tot_studenti < course.max_studenti : true)
                                        .map(course => <option key={course.codice} value={course.codice}>{course.nome}</option>)
                                }
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col-md-1">
                        <Button className="m-auto w-75 text-center rounded-pill" type='submit' onClick={handleSubmit} disabled={!currentCourse}> Add </Button>
                    </Col>
                </Row>
            </Form>
            {currentPlan.length ? <PlanList plan={currentPlan} handleX={handleX}/> : false}
            <p>CFU: {currentCFU}</p>
            <Row className="justify-content-center">
                <Col className="col-md-1"> <Button className="rounded-pill w-100" variant="danger" onClick={handleCancel}> Cancel </Button> </Col>
                <Col className="col-md-1"> <Button className="rounded-pill w-100" variant="success" onClick={() => { }} > Submit </Button></Col>
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
                props.plan.map(course => 
                <ListGroup.Item key={course.codice} as='li' className="d-flex justify-content-beetween mb-3 py-3">
                    <Container>{course.codice}</Container>
                    <Container>{course.nome}</Container>
                    <Container>{course.crediti}</Container>
                    <Container ><BsXCircleFill style={{cursor:"pointer"}} color="red" size="20px" onClick={() => props.handleX(course.codice, course.crediti)}/></Container>
                </ListGroup.Item>)
            }
        </ListGroup>
    )
}

export default PlanForm;