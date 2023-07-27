import axios from 'axios'

async function handleRequest(method: string, url: string, data?: any) {
    try {
        const response = await axios({
            method: method,
            url: 'https://nqsvdlv6ab.execute-api.us-west-1.amazonaws.com/dev' + url,
            data: data,
            headers: {'Authorization' : 'Bearer ' + localStorage.getItem('access_token')}
        })
        return response
    } catch (error: any) {
        console.log(error)
        return error
    }
}

export default handleRequest