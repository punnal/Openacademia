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
    .catch((e) => console.log("error:", e));
};

export default dbPush;
