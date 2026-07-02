module.exports.config = {
  api: {
    bodyParser: false, // 트레이딩뷰 원본 데이터를 가공하지 않도록 설정
  },
};

// 스트림 데이터를 순수 텍스트 원본 그대로 읽어오는 함수
async function readRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const rawBody = await readRawBody(req);

    // 핵심: 3Commas 방화벽을 통과하기 위해 트레이딩뷰 공식 봇인 것처럼 헤더를 위장합니다.
    const response = await fetch('https://3commas.io/trade_relay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TradingView-Webhook/1.0', 
        'Accept': 'application/json'
      },
      body: rawBody,
    });

    const data = await response.text();
    
    // 3Commas의 응답 결과를 그대로 반환 (정상이면 200이 돌아옵니다)
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
