// netlify/functions/subtitle-proxy.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing URL parameter',
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        // --- BDLV Explains: यह है वह जादुई अनुमति वाला स्टिकर! ---
        'Access-Control-Allow-Origin': '*', 
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch subtitle' }),
    };
  }
};