import { Button } from "bootstrap";
import { useState } from "react";
import { Container, ListGroup, Table } from "react-bootstrap";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import './courselist.css';

function CourseList(props) {

    return (
        <Container fluid className="vh-100 below-nav">
            {
                props.user
                    ? props.plan
                        ? <h2>Your Plan</h2>
                        : <h2>Exams List</h2>
                    : <h2>Exams List</h2>
            }
            <ListGroup variant="flush" className="px-3">
                <ListGroup.Item key="titles" as='li' className="d-flex justify-content-beetween list-titles">
                    <Container>Codice</Container>
                    <Container>Corso</Container>
                    <Container>CFU</Container>
                    <Container>Tot Studenti</Container>
                    <Container>Max Studenti</Container>
                    <Container>Incompatibilità/Propedeuticità</Container>
                    {/* <Container>Incompatibilità</Container>
                    <Container>Propedeuticità</Container> */}
                </ListGroup.Item>
                {props.courses.map(course => <CourseItem course={course} />)}
            </ListGroup>


        </Container>
    );
}

function CourseItem(props) {

    const [description, setDescription] = useState(false);

    const handleClick = () => {
        setDescription(!description);
    }

    return (
        <ListGroup.Item key={props.course.codice} as='li' className="d-flex justify-content-beetween px-0 py-4">
            <Container>{props.course.codice}</Container>
            <Container>{props.course.nome}</Container>
            <Container>{props.course.crediti}</Container>
            <Container>{props.course.tot_studenti}</Container>
            <Container>{props.course.max_studenti}</Container>
            {
                description
                    ? <Container>
                        <Container><BsChevronUp className="mb-2" size="20px" onClick={handleClick}/></Container>
                            <Container>
                                {props.course.incompatibilita ? `Incompatibilità: ${props.course.incompatibilita?.replace('\n', ', ')}` : undefined}
                            </Container>
                            <Container>
                                {props.course.propedeuticita ? `Propedeuticità: ${props.course.propedeuticita}` : undefined}
                            </Container>
                        </Container>
                        : <Container><BsChevronDown size="20px" onClick={handleClick}/></Container>
        }

                        {/* {<Container>{course.incompatibilita?.replace('\n', ', ')}</Container>
        <Container>{course.propedeuticita}</Container>} */}
                    </ListGroup.Item>
    )
}

            export default CourseList;