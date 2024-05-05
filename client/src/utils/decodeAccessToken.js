import { jwtDecode } from 'jwt-decode';

const decodeAccessToken = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);

    const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
    const currentTime = Date.now();
    const tokenExp = Math.ceil(Math.abs((expirationTime - currentTime) / 1000));

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('tokenExp', tokenExp);

    const user = {
      _id: decodedToken._id,
      name: decodedToken.name,
      role: decodedToken.role,
    }
    return user

  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null
  }
};

export default decodeAccessToken;