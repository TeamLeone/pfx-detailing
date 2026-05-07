export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(502).json({ error: 'Upstream error', status: data.status });
    }

    const reviews = (data.result && data.result.reviews ? data.result.reviews : [])
      .filter(r => r.rating === 5)
      .map(r => ({
        author_name: r.author_name,
        rating: r.rating,
        text: r.text,
        relative_time_description: r.relative_time_description || ''
      }));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
