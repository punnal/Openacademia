const dbPull = (url, callback) => {
  fetch(url)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((json) => callback(json, url))
    .catch((e) => console.log(e));
};
const dbPush = (url, data, callback) => {
  let body = {
    data: data,
  };
  console.log(body);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => {
      console.log(resp);
      return callback ? resp.json() : null;
    })
    .then((json) => callback(json))
    .catch(() => console.log("caught"));
};

export default dbPull;
