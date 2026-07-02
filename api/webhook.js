export default async function handler(req, res) {
  // 1. POST 요청이 아니면 거부
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. 트레이딩뷰가 보내는 데이터가 문자열이든 JSON 객체든 상관없이 안전하게 문자열로 변환
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // 3. 3Commas 공식 웹훅 주소로 전달
    const response = await fetch('https://3commas.io/trade_relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    const data = await response.text();
    
    // 4. 3Commas의 처리 결과를 그대로 반환
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
