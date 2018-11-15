import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://your-name.firebaseio.com'
})

export default instance