// Vercel이 데이터를 마음대로 건들지 못하도록 자동 파서 기능을 완전히 끕니다.
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

// 스트림 데이터를 순수 텍스트 원본 그대로 읽어오는 함수입니다.
async function readRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

module.exports = async (req, res) => {
  // POST 요청이 아니면 거부
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // 트레이딩뷰가 보낸 원본 메시지를 한 글자도 안 틀리고 그대로 추출합니다.
    const rawBody = await readRawBody(req);

    // 3Commas 공식 웹훅 주소로 가공 없이 그대로 토스합니다.
    const response = await fetch('https://3commas.io/trade_relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rawBody,
    });

    const data = await response.text();
    
    // 3Commas의 응답 결과를 그대로 반환합니다.
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
