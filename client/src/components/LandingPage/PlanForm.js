import { useState } from "react";
import { Form, Button, Row, Col, Container, ListGroup, Alert } from "react-bootstrap";
import { BsXCircleFill } from "react-icons/bs";

function PlanForm(props) {

    const [currentCourse, setCurrentCourse] = useState(''); //form's value
    const [planType, setPlanType] = useState(props.type); //1 full time, 0 part time
    const [boundCrediti, setBoundCrediti] = useState(planType ? { max: 80, min: 60 } : { max: 40, min: 20 });
    const [error, setError] = useState("");


    const handleAdd = (event) => {
        event.preventDefault();
        const current = props.courses.find(course => course.codice === currentCourse);
        if (props.currentCrediti + current.crediti > boundCrediti.max) {
            setError(`Il corso "${current.titolo}" non può essere aggiunto perchè produrrebbe un numero troppo elevato di crediti per il piano di studio selezionato.`)
        } else if (current.max_studenti === current.tot_studenti) {
            setError(`Il corso "${current.titolo}" non può essere aggiunto perchè ha raggiunto la soglia massima di studenti.`)
        }
        else {
            props.addCourseToPlan(current);
            setCurrentCourse('');
            setError('');
        }

    }

    const handleCancel = () => {
        props.cancelCurrentPlan();
        if (props.add) {
            props.setAdd(false);
        } else {
            props.setEdit(false);
        }
        setPlanType();
    }

    const handleSave = () => {
        if (props.currentCrediti < boundCrediti.min) {
            setError("Numero di CFU insifficiente per poter salvare il piano di studi.");
        } else if (props.currentCrediti > boundCrediti.max) {
            setError("Numero di CFU troppo elevato per poter salvare il piano di studi.");
        } else {
            props.saveCurrentPlan(planType);
        }
    }

    function handleSwitchType(value) {
        switch (value) {
            case 0:
                if (props.currentCrediti > 40) {
                    setError("Numero di CFU troppo elevato per selezionare l'opzione: Part Time.");
                } else {
                    setBoundCrediti({ max: 40, min: 20 })
                    setPlanType(value);
                }
                break;

            default:
                setBoundCrediti({ max: 80, min: 60 })
                setPlanType(value);
                break;
        }
    }

    function handleX(course) {
        if (props.currentPlan.map(p => p.propedeuticita).find(propedeuticita => propedeuticita === course.codice)) {
            const propedeutico = props.currentPlan.find(cod => cod.propedeuticita === course.codice);
            setError(`Non puoi eliminare il corso poichè propedeutico ad "${propedeutico.titolo}"`)
        } else {
            props.deleteCourseFromPlan(course.codice, course.crediti);
        }
    }


    return (
        <div>
            <p style={{ fontWeight: "600", fontSize: "3.5rem", margin: "0", paddingBottom: "10px" }}> {props.add ? "Add Plan" : "Edit Plan"}</p>
            <Row className="w-100 m-auto">
                {error ? <Alert className="w-25 m-auto mb-3" variant='danger' onClose={() => { setError(''); }} dismissible>{error}</Alert> : false}
                    {planType !== null 
                        ? <p style={{fontSize: "2rem"}}>Plan type selected: <span style={{fontWeight:"600"}}>{planType ? "Full Time" : "Part Time"}</span></p>
                        : <p style={{fontSize: "2rem", fontWeight:"400"}}>Seleziona il piano di studi per continuare</p>}
                <Container className="mb-3">
                    {
                        planType !== null
                            ? false
                            : <> 
                                <Button className="m-auto text-center rounded-pill me-2" onClick={() => handleSwitchType(1)}>Full Time</Button>
                                <Button className="m-auto text-center rounded-pill ms-2" onClick={() => handleSwitchType(0)}>Part Time</Button>
                            </>
                    }
                </Container>
            </Row>
            <Form onSubmit={handleAdd} className="d-flex m-auto mb-3">
                <Row className="justify-content-center w-100">
                    <Col className="col-md-4">
                        <Form.Group className="m-auto">
                            <Form.Control as="select" value={currentCourse} onChange={(event) => { setCurrentCourse(event.target.value) }} disabled={planType === null}>
                                <option hidden value=''>Select a course...</option>
                                {
                                    // Filter the entire list in order to select only the available courses based on currentPlan
                                    props.courses
                                        .filter(course => !props.currentPlan?.find(p => p.codice === course.codice)) //filter film already added
                                        .filter(course => course.propedeuticita
                                            ? course.propedeuticita.split().some(codice => props.currentPlan?.map(p => p.codice).includes(codice)) //true because at the beginning the currentPlan in empty
                                            : true)                                                                                             //when the courses will be added it returns false
                                        .filter(course => course.incompatibilita
                                            ? !course.incompatibilita.split("\n").some(codice => props.currentPlan?.map(p => p.codice).includes(codice)) //return true if it found some incompatibility so !true
                                            : true)
                                        .map(course => <option key={course.codice} value={course.codice}>{course.titolo}</option>)
                                }
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col className="col-md-1">
                        <Button className="m-auto w-75 text-center rounded-pill" type='submit' onClick={handleAdd} disabled={currentCourse ? false : true }> Add </Button>
                    </Col>
                </Row>
            </Form>
            {props.currentPlan.length ? <PlanList currentPlan={props.currentPlan} handleX={handleX} /> : false}
            <Row>
                <p>CFU: {props.currentCrediti}</p>
                <p>
                    {planType !== null
                        ? `Min CFU: ${boundCrediti.min} - Max CFU: ${boundCrediti.max}`
                        : false}
                </p>
            </Row>
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
                        <Container ><BsXCircleFill style={{ cursor: "pointer" }} color="red" size="20px" onClick={() => props.handleX(course)} /></Container>
                    </ListGroup.Item>)
            }
        </ListGroup>
    )
}

export default PlanForm;