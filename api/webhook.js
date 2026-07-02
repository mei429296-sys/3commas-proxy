export const config = {
  runtime: 'edge', // 1. 전 세계에서 가장 가까운 서버에서 0ms에 가깝게 초고속 실행
};

export default async function handler(request) {
  // POST 요청이 아니면 거부
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 2. 트레이딩뷰가 보내는 텍스트 그대로를 가공 없이 순수하게 읽어옴 (포맷 깨짐 방지)
    const rawBody = await request.text();

    // 3. 3Commas 공식 웹훅 주소로 딜레이 없이 즉시 토스
    const response = await fetch('https://3commas.io/trade_relay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rawBody,
    });

    const data = await response.text();
    
    // 3Commas의 처리 결과를 브라우저/트레이딩뷰에 그대로 반환
    return new Response(data, { status: response.status });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
