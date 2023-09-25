export const apiWrapper = (route : string , body : object | null) => {
    return fetch("http://localhost:8080/api/v1/" + route, body? body : {})
}