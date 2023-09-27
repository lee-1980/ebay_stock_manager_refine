export const apiWrapper = (route : string , body : object | null) => {
    return fetch("http://localhost:8000/api/v1/" + route, body? body : {})
}