import { useEffect, useState } from "react";
import { Button, Container, ListGroup, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { BsChevronDown, BsChevronUp, BsExclamationCircleFill } from "react-icons/bs";
import './courselist.css';

function CourseList(props) {


    return (
        <Container fluid className="mt-4">
            {
                props.loading
                    ? <Spinner animation="border" variant="primary" />
                    : <Container fluid className="vh-100">
                        <h2>Courses List</h2>
                        <ListGroup variant="flush" className="px-3">
                            <ListGroup.Item key="title" as='li' className="d-flex justify-content-beetween list-titles">
                                <Container>Codice</Container>
                                <Container>Corso</Container>
                                <Container>CFU</Container>
                                <Container>Tot Studenti</Container>
                                <Container>Max Studenti</Container>
                                <Container>Incompatibilità/Propedeuticità</Container>
                            </ListGroup.Item>
                            {props.courses.map(course => <CourseItem key={course.codice} course={course} currentPlan={props.currentPlan} add={props.add} edit={props.edit} />)} {/* Key should be specified inside the array. */}
                        </ListGroup>
                    </Container>
            }
        </Container>
    );
}

function CourseItem(props) {

    const [description, setDescription] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        if (props.add || props.edit) { //if there isnt a currentPlan => no need to show the colors (add or edit)
                if (props.currentPlan?.map(p => p.codice).find(cod => cod === props.course.codice)) { //return truthy if the code is found in the currentPlan list
                    setSelected(true);
                    setWarningMessage("");
                } else {
                    setSelected(false);
                    if (props.course.incompatibilita) {
                        if (props.course  //return true if an incompatibility is found
                            .incompatibilita?.split('\n')
                            .some(i => props.currentPlan?.map(p => p.codice).find(currentPlanC => currentPlanC === i))) {
    
                            setWarningMessage( `Incompatibile con il corso ${props.course.incompatibilita?.split('\n')
                            .find(ci => props.currentPlan?.map(p => p.codice).some(pi => pi === ci))}.` );
                        }
                        if (props.course.propedeuticita) {
                            if (!props.course
                                .propedeuticita?.split("\n")
                                .some(propedeuticita => props.currentPlan?.map(p => p.codice)
                                    .find(currentPlanC => currentPlanC === propedeuticita))) { //return truthy if the propedeuticita isnt in the currentPlan list
                                setWarningMessage(`Il corso ${props.course.propedeuticita} non è stato ancora aggiunto alla lista.`);
                            }
                        }
                    }
                }
            } else {
                setWarningMessage("");
                setSelected(false);
            }
        }, [props.course.codice, props.course.incompatibilita, props.course.propedeuticita, props.currentPlan, props.add, props.edit])
    

    const handleClick = () => {
        setDescription(!description);
    }

    return (
        <ListGroup.Item as='li' className="d-flex justify-content-beetween px-0 py-4"
            style={
                {
                    backgroundColor:
                        !selected
                            ? warningMessage
                                ? '#ffcdd2'
                                : false
                            : '#c8e6c9'
                }
            }>
            <Container>{props.course.codice}</Container>
            <Container>
                {props.course.titolo}
                {warningMessage
                    ? <OverlayButton showInformation={warningMessage} /> : false
                }
            </Container>
            <Container>{props.course.crediti}</Container>
            <Container>{props.course.tot_studenti}</Container>
            <Container>{props.course.max_studenti}</Container>
            {
                description
                    ? <Container>
                        <Container style={{ cursor: "pointer" }}><BsChevronUp className="mb-2" size="20px" onClick={handleClick} /></Container>
                        <Container>
                            {props.course.incompatibilita ? `Incompatibilità: ${props.course.incompatibilita?.replace('\n', ', ')}` : undefined}
                        </Container>
                        <Container>
                            {props.course.propedeuticita ? `Propedeuticità: ${props.course.propedeuticita}` : undefined}
                        </Container>
                    </Container>
                    : <Container style={{ cursor: "pointer", visibility: (props.course.incompatibilita || props.course.propedeuticita) ? false : "hidden" }} ><BsChevronDown size="20px" onClick={handleClick} /></Container>
            }
        </ListGroup.Item>
    )
}

function OverlayButton(props) {
    return (
        <OverlayTrigger
            key='right'
            placement='right'
            overlay={
                <Tooltip id={`tooltip-right`}>
                    {props.showInformation}
                </Tooltip>
            }>
            <Button variant='danger' className="btn btn-sm ms-2" ><BsExclamationCircleFill /></Button>
        </OverlayTrigger>
    )

}

export default CourseList;