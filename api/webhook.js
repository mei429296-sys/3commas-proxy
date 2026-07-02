module.exports.config = {
  api: {
    bodyParser: false, // 트레이딩뷰 원본 데이터를 그대로 받기 위함
  },
};

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

    // ★ 3Commas 진짜 웹훅 목적지 주소로 수정했습니다.
    // 현재 사용하시는 봇이 '시그널 봇(Signal Bot)'이면 아래 주소 그대로 쓰시면 됩니다.
    // (혹시 'DCA 봇'을 쓰신다면 주소를 'https://app.3commas.io/trade_signal/trading_view' 로 바꿔주세요)
    const targetUrl = 'https://api.3commas.io/signal_bots/webhooks';

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: rawBody,
    });

    const data = await response.text();
    
    // 3Commas가 보내준 결과(성공 시 200 OK)를 그대로 반환합니다.
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
