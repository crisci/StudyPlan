import { Container } from "react-bootstrap";
import Nav from "./Navbar";
import CourseList from "./CourseList/CourseList";
import UserView from "./UserView";
import { Outlet } from "react-router-dom";


function LandingPage(props) {

    function displayUserView() {
        if(!props.user?.id || props.edit || props.add) //se sto editando o modificando oppure non sono loggato UserView non verrà mostrato
            return false;
        return true;
    }

    return (
        <>
            <Nav user={props.user} doLogOut={props.doLogOut}/>
            <Container fluid style={{ paddingTop: "4rem" }} className="text-center">
                {/* Se presente l'utente (una volta loggato) mostra la sua schermata con eventualmente un piano di studi
                    altrimenti non sarà loggato e non deve mostrare nulla. */}
                {displayUserView() ? <UserView user={props.user} currentPlan={props.currentPlan} crediti={props.crediti} plan={props.plan} setAdd={props.setAdd} add={props.add} edit={props.edit} setEdit={props.setEdit} deletePlan={props.deletePlan} planLoading={props.planLoading} netError={props.netError} resetError={props.resetError}/> : false} 
                <Outlet />
                <CourseList loading={props.coursesLoading} courses={props.courses} currentPlan={props.currentPlan} add={props.add} edit={props.edit}/>
            </Container>
        </>
    )
}

export default LandingPage;