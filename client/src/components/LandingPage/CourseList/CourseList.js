import { useState } from "react";
import { Container, ListGroup, Spinner } from "react-bootstrap";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import './courselist.css';

function CourseList(props) {
    

    return (
        <>
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
                        {props.courses.map(course => <CourseItem key={course.codice} course={course} />)} {/* Key should be specified inside the array. */}
                    </ListGroup>
                </Container>
            }
        </>
    );
}

function CourseItem(props) {

    const [description, setDescription] = useState(false);

    const handleClick = () => {
        setDescription(!description);
    }

    return (
        <ListGroup.Item as='li' className="d-flex justify-content-beetween px-0 py-4">
            <Container>{props.course.codice}</Container>
            <Container>{props.course.nome}</Container>
            <Container>{props.course.crediti}</Container>
            <Container>{props.course.tot_studenti}</Container>
            <Container>{props.course.max_studenti}</Container>
            {
                description
                    ? <Container>
                        <Container style={{cursor:"pointer"}}><BsChevronUp className="mb-2" size="20px" onClick={handleClick}/></Container>
                            <Container>
                                {props.course.incompatibilita ? `Incompatibilità: ${props.course.incompatibilita?.replace('\n', ', ')}` : undefined}
                            </Container>
                            <Container>
                                {props.course.propedeuticita ? `Propedeuticità: ${props.course.propedeuticita}` : undefined}
                            </Container>
                        </Container>
                        : <Container style={{cursor:"pointer", visibility: (props.course.incompatibilita || props.course.propedeuticita) ? false : "hidden"}} ><BsChevronDown size="20px" onClick={handleClick}/></Container>
        }
                    </ListGroup.Item>
    )
}

            export default CourseList;