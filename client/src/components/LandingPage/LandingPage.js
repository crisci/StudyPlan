import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import API from "../../API";
import Nav from "./Navbar/Navbar";
import CourseList from "./CourseList/CourseList";
import UserView from "./UserView/UserView";
import PlanForm from "./PlanForm/PlanForm";
import { Outlet } from "react-router-dom";


function LandingPage(props) {

    const id = "iondaosiicna";


    return (
        <>
            <Nav user={props.user} />
            <Container fluid style={{ paddingTop: "4rem" }} className="text-center">
                {/* Se presente l'utente (una volta loggato) mostra la sua schermata con eventualmente un piano di studi
                    altrimenti non sarà loggato e non deve mostrare nulla. */}
                {props.user?.id ? <UserView user={props.user} plan={props.plan} /> : false} 
                <Outlet />
                <CourseList loading={props.coursesLoading} courses={props.courses} />
            </Container>
        </>
    )
}

export default LandingPage;