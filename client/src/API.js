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

function getPlan() {
  return new Promise((resolve, reject) => {
    fetch(`${APIURL}/plans`, { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          resolve(res.json());
        }
      })
  });
}

function addPlan(plan, type) {
  return new Promise((resolve, reject) => {
    fetch(`${APIURL}/plans`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: type, plan: plan })
      }).then(response => {
        if (response.ok) {
          resolve(null);
        } else {
          response.json().then(error => reject({ errMessage: error }).catch(() => reject({ errorMessage: "Cannot parse server response." })));
        }
      }).catch(() => resolve({ errMessage: "Unable to comunicate with the server." }));
  });
}

function updateCurrentPlan(plan, type) {
  return new Promise((resolve, reject) => {
    fetch(`${APIURL}/plans`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: type, plan: plan })
      }).then(response => {
        if (response.ok) {
          resolve(null);
        } else {
          response.json().then(error => reject({ errMessage: error }).catch(() => reject({ errorMessage: "Cannot parse server response." })));
        }
      }).catch(() => resolve({ errMessage: "Unable to comunicate with the server." }));
  });
}


function deletePlan() {
  return new Promise((resolve, reject) => {
    fetch(`${APIURL}/plans`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    ).then(response => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json().then(error => reject({ errMessage: error }).catch(() => reject({ errorMessage: "Cannot parse server response." })));
      }
    }).catch(() => resolve({ errMessage: "Unable to comunicate with the server." }));
  });
}

async function logIn(credentials) {
  return fetch(`${APIURL}/sessions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
}).then(async res => {
    if (res.ok)
        return res.json();
    throw await res.json();
});
}


async function logOut() {
  await fetch(`${APIURL}/sessions/current`, { method: 'DELETE', credentials: 'include' });
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    fetch(`${APIURL}/sessions/current`, { credentials: 'include' }).then(res => {
      res.json()
        .then(resJSON => {
          if (res.ok) {
            resolve(resJSON);
          } else {
            reject(resJSON);
          }
        }).catch(() => reject("Unable to parse user datas."));
    });
  });
}

const API = { getAllCourses, logIn, logOut, getUserInfo, getPlan, addPlan, deletePlan, updateCurrentPlan };
export default API;