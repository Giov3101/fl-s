import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const API_KEY = process.env.VITE_API_KEY;
const API_SECRET = process.env.VITE_API_SECRET;

const AMADEUS_AUTH_URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';
const AMADEUS_SEARCH_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

let cachedAccessToken = null;

async function getAccessToken() {
  // Vérifier si le token est en cache et valide
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    console.log('✅ Using cached access token');
    return cachedAccessToken.token;
  }

  console.log('📝 Fetching new access token from:', AMADEUS_AUTH_URL);
  console.log('🔐 API Key:', API_KEY ? 'configured' : 'MISSING');
  console.log('🔐 API Secret:', API_SECRET ? 'configured' : 'MISSING');
  
  if (!API_KEY || !API_SECRET) {
    console.error('❌ API credentials not configured!');
    return null;
  }
  
  try {
    const response = await fetch(AMADEUS_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Auth error:', response.status);
      console.error('Response:', data);
      throw new Error(`Authentication failed: ${response.status}`);
    }

    if (!data.access_token) {
      console.error('❌ No access token in response:', data);
      throw new Error('No access token received from Amadeus');
    }

    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + ((data.expires_in || 1800) * 1000),
    };

    console.log('✅ Access token obtained, expires in:', data.expires_in, 'seconds');
    return data.access_token;
  } catch (error) {
    console.error('⚠️  Failed to get access token:', error.message);
    throw error;
  }
}

// Route pour rechercher des vols
app.post('/api/search-flights', async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
    } = req.body;

    console.log('\n🔍 Flight search request:');
    console.log('  Origin:', originLocationCode);
    console.log('  Destination:', destinationLocationCode);
    console.log('  Departure Date:', departureDate);
    console.log('  Adults:', adults);

    const accessToken = await getAccessToken();

    if (accessToken) {
      // Utiliser l'API Amadeus
      const searchParams = new URLSearchParams({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults: adults.toString(),
        max: '250',
      });

      if (returnDate) {
        searchParams.append('returnDate', returnDate);
      }

      const searchUrl = `${AMADEUS_SEARCH_URL}?${searchParams.toString()}`;
      console.log('📍 Calling Amadeus API...');

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ Flight search error:', response.status, responseData);
        return res.status(response.status).json(responseData);
      }

      console.log('✅ Flight search successful:', responseData.data?.length || 0, 'flights found');
      return res.json(responseData);
    } else {
      console.error('❌ Failed to get access token');
      return res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('❌ Server error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(port, () => {
  console.log(`\n🚀 Amadeus proxy server running on http://localhost:${port}`);
  console.log(`📚 Using test environment: https://test.api.amadeus.com\n`);
});
