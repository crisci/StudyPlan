const APIURL = new URL('http://localhost:3001/api');

function getAllCourses() {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/courses`)
            .then(res => {
                if (res.ok) {
                    resolve(res.json())
                }
            })
    });
}

const API = { getAllCourses };
export default API;