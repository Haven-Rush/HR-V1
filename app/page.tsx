export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Haven Rush V1 - Backend API</h1>
      <p>Backend is ready. Use the following endpoints:</p>
      <ul>
        <li>
          <strong>POST /api/moneyball</strong> - Record visitor events
          <pre style={{ background: '#f4f4f4', padding: '1rem', marginTop: '0.5rem' }}>
{`{
  "visitor_id": "uuid",
  "property_id": "uuid",
  "event_type": "check_in",
  "metadata": {}
}`}
          </pre>
        </li>
        <li>
          <strong>GET /api/moneyball?visitor_id=uuid&property_id=uuid</strong> - Get engagement score
        </li>
      </ul>
    </main>
  )
}
