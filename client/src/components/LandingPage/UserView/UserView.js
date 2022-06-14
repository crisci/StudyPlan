import { Button, Container, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UserView(props) {

    return (
        <Container fluid>
            <h2>Welcome, {props.user?.nome}</h2>
            {(props.plan?.length)
                ? <StudyPlanAvailable type={props.user.available} crediti={props.crediti} edit={props.edit} setEdit={props.setEdit} plan={props.plan} deletePlan={props.deletePlan}/>
                : <StudyPlanNotAvailable setAdd={props.setAdd} add={props.add} />}
        </Container>
    )
}

function StudyPlanAvailable(props) {

    const navigate = useNavigate();


    const handleEdit = () => {
        props.setEdit(true);
        navigate('/editPlan');
    }

    const handleDelete = () => {
        props.deletePlan();
        navigate('/');
    }

    return (
        <>
            {
                !props.edit
                    ? <Container fluid>
                        <p style={{ fontWeight: "600", fontSize: "1.8rem", margin: "0" }}> Your current plan </p>
                        <p style={{ fontWeight: "400", fontSize: "1.2rem", margin: "0" }}> Type: {props.type ? "Full Time" : "Part Time"}</p>
                        <p style={{ fontWeight: "400", fontSize: "1.2rem", margin: "0" }}> Totale CFU: {props.crediti}</p>
                        <ListGroup variant="flush" className="px-3">
                            <ListGroup.Item key="title" as='li' className="d-flex justify-content-beetween list-titles">
                                <Container>Codice</Container>
                                <Container>Corso</Container>
                                <Container>CFU</Container>
                            </ListGroup.Item>
                            {props.plan
                                ?.map(p => <ListGroup.Item key={p.codice} as='li' className="d-flex mb-3">
                                    <Container>{p.codice}</Container>
                                    <Container>{p.titolo}</Container>
                                    <Container>{p.crediti}</Container>
                                </ListGroup.Item>)}
                        </ListGroup>
                        <Container>
                            <Button variant="primary" style={{ width: "10rem", borderRadius: "2rem" }} onClick={handleEdit}>Edit</Button>
                            <Button variant="danger" style={{ width: "10rem", borderRadius: "2rem" }} onClick={handleDelete}>Delete</Button>
                        </Container>
                    </Container>
                    : false
            }
        </>

    );
}

function StudyPlanNotAvailable(props) {

    const navigate = useNavigate();

    const handleAdd = () => {
        props.setAdd(true);
        navigate('/editPlan');
    }

    return (
        <>
            {
                !props.add
                    ? <Container fluid className="px-4 ">
                        <p style={{ fontWeight: "600", fontSize: "1.8rem", margin: "0" }}> Study plan not available! </p>
                        <p style={{ fontSize: "1.4rem" }}> Click the button down below to add it. </p>
                        <Button variant="primary" style={{ width: "10rem", borderRadius: "2rem" }} onClick={handleAdd}>Add</Button>
                    </Container>
                    : false
            }
        </>
    );
}


export default UserView;