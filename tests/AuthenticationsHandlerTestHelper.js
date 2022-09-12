/* istanbul ignore file */
const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');

class AuthenticationsHandlerTestHelper {
  static async register({
    username = 'cisnux',
    password = 'secret',
    fullname = 'Cisnux',
  }) {
    // add user
    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username,
        password,
        fullname,
      },
    });
    const responseJson = JSON.parse(response.payload);
    return { ...responseJson.data.addedUser, password };
  }

  static async login({ username, password }) {
    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username,
        password,
      },
    });
    const responseJson = JSON.parse(response.payload);
    return responseJson.data.accessToken;
  }
}

module.exports = AuthenticationsHandlerTestHelper;
