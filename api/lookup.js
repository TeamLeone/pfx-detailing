// TEMPORARY: delete after confirming the correct Place ID.
export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_API_KEY not configured.' });
  }

  const input = (req.query.q || 'PureFX Detailing').toString();
  const locationBias = (req.query.bias || 'point:33.9803329,-84.586816').toString();

  const params = new URLSearchParams({
    input,
    inputtype: 'textquery',
    fields: 'place_id,name,formatted_address,rating,user_ratings_total',
    locationbias: locationBias,
    key: apiKey,
  });

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params}`
    );
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Lookup failed' });
  }
}
