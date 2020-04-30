
module.exports = {
    backendStatus(response) {
        if(response.status > 302) {
            alert(response)
            return false
        } else {
            return true
        }
    },
}