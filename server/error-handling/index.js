module.exports = (app) => {
    app.use((request, response, next) => {
        response.status(477).json({message: "INVALID FORMAT"})
    });
    app.use((request, response, next) => {
        response.status(400).json({message: "BAD REQUEST"})
    });
    app.use((Error, request, response, next) => {
        console.log("ERROR", request.method, request.path, error)
    })
    if (!res.headersSent){
        res.status(500).send('Internal Server Error!')
    }
}