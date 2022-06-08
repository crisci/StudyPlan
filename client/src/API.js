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

//  ! If you want to use return Promise
//  ! remember to resolve(something).
async function logIn(credentials) {
  let response = await fetch(`${APIURL}/sessions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}


async function logOut() {
  await fetch(`${APIURL}/sessions/current`, { method: 'DELETE', credentials: 'include' });
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    fetch(`${APIURL}/sessions/current`,
      {
        credentials: 'include'
      }
    ).then(res => {
      if (res.ok) {
        resolve(res.json());
      } else {
        reject(res.json());
      }
    })
  });

}

const API = { getAllCourses, logIn, logOut, getUserInfo };
export default API;