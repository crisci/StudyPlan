import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import API from "../../API";
import Nav from "./Navbar/Navbar";
import CourseList from "./CourseList/CourseList";
import UserView from "./UserView/UserView";


function LandingPage(props) {

    const [courses, setCourses] = useState([]);
    const [plan, setPlan] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    useEffect(() => {
        setCoursesLoading(true);
        API.getAllCourses().then(
            courses => {
                setCourses(courses);
                setCoursesLoading(false);
            }
        );
    }, [])



    return(
        <>
        <Nav user={props.user}/>
        <Container fluid style={{paddingTop: "4rem"}} className="text-center">
            {props.user?.id ? <UserView user={props.user} plan={plan}/> : false}
            <CourseList loading={coursesLoading} courses={courses}/>
        </Container>
        </>
    )
}

export default LandingPage;