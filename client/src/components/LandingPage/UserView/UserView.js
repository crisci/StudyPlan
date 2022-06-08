import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function UserView(props) { 

    return (
        <Container fluid className="mb-4">
            <h2>Welcome, {props.user?.nome}</h2>
            {props.plan.length
                ? true
                : <StudyPlanNotAvailable/>}
        </Container>
    )
}

function StudyPlanNotAvailable(props) {

    const navigate = useNavigate();

    return (
        <Container fluid className="px-4 ">
            <p style={{fontWeight:"600", fontSize:"1.8rem", margin:"0"}}> Study plan not available! </p>
            <p style={{fontSize:"1.4rem"}}> Click the button down below to add it. </p>
            <Button variant="primary" style={{width:"10rem", borderRadius:"2rem"}} onClick={() => {navigate('/addPlan')}}>Add</Button>
        </Container>
    );
}


export default UserView;