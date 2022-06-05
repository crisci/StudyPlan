import { useEffect, useState } from "react";
import API from "../../API";
import CourseList from "./CourseList/CourseList";
import Nav from "./Navbar/Navbar";


function LandingPage(props) {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if(!courses.length)
        API.getAllCourses().then(
            courses => setCourses(courses)
        );
    }, [])


    return(
        <>
        <Nav/>
        <CourseList courses={courses}/>
        </>
    )
}

export default LandingPage;