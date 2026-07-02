// api/webhook.js
export default async function handler(req, res) {
  // POST 요청이 아니면 거부
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // TradingView에서 받은 신호를 3Commas 공식 웹훅 주소로 초고속 토스
    const response = await fetch('https://3commas.io/trade_relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    
    // 3Commas의 응답 결과를 그대로 반환
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
