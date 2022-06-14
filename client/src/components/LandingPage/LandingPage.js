import { Container } from "react-bootstrap";
import Nav from "./Navbar/Navbar";
import CourseList from "./CourseList/CourseList";
import UserView from "./UserView/UserView";
import { Outlet } from "react-router-dom";


function LandingPage(props) {

    function displayUserView() {
        if(!props.user?.id || props.edit || props.add) 
            return false;
        return true;
    }

    return (
        <>
            <Nav user={props.user} navigateToUserPage={props.navigateToUserPage}/>
            <Container fluid style={{ paddingTop: "4rem" }} className="text-center">
                {/* Se presente l'utente (una volta loggato) mostra la sua schermata con eventualmente un piano di studi
                    altrimenti non sarà loggato e non deve mostrare nulla. */}
                {displayUserView() ? <UserView user={props.user} currentPlan={props.currentPlan} crediti={props.crediti} plan={props.plan} setAdd={props.setAdd} add={props.add} edit={props.edit} setEdit={props.setEdit} deletePlan={props.deletePlan}/> : false} 
                <Outlet />
                <CourseList loading={props.coursesLoading} courses={props.courses} currentPlan={props.currentPlan} add={props.add} edit={props.edit}/>
            </Container>
        </>
    )
}

export default LandingPage;