console.log("I am the client");

(async () => {
    const res = await fetch("http://localhost:3000/getStats");
    console.log(await res.text());
})();
