import { Button } from "bootstrap";
import { Container, ListGroup, Table } from "react-bootstrap";
import './courselist.css';

function CourseList(props) {

    const courses = [{ codice: "02GOLOV", nome: "Architetture dei sistemi di elaborazione", crediti: 12, max_studenti: undefined, inconpatibilita: "02LSEOV", propedeuticita: undefined },
    { codice: "02LSEOV", nome: "Computer architectures", crediti: 12, max_studenti: undefined, inconpatibilita: "02GOLOV", propedeuticita: undefined },
    { codice: "01SQLOV", nome: "Database systems", crediti: 8, max_studenti: 4, inconpatibilita: "01SQJOV, 01SQMOV", propedeuticita: "01UDFOV" }];


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
                    <Container>Max Studenti</Container>
                    <Container>Incompatibilità</Container>
                    <Container>Propedeuticità</Container>
                </ListGroup.Item>
                {courses.map(course => <ListGroup.Item key={course.codice} as='li' className="d-flex justify-content-beetween px-0 py-4">
                    <Container>{course.codice}</Container>
                    <Container>{course.nome}</Container>
                    <Container>{course.crediti}</Container>
                    <Container>{course.max_studenti}</Container>
                    <Container>{course.inconpatibilita}</Container>
                    <Container>{course.propedeuticita}</Container>
                </ListGroup.Item>)}
            </ListGroup>


        </Container>
    );
}

export default CourseList;