export default {

  API_PATH: {
    development: 'http://localhost:8001',
    production: 'https://scheduler01.herokuapp.com/'
  }[process.env.NODE_ENV || 'development']
}