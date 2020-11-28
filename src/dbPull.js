const dbPull = (url, callback) => {
  fetch(url)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((json) => callback(json, url))
    .catch((e) => console.log(e));
};
export default dbPull;
