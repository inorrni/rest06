// 도로 SVG + 정류장 레이어 + 버스 스프라이트. 좌표/움직임은 road-engine 훅이 채운다.
export default function RoadLayer() {
  return (
    <>
      <svg className="road-svg" id="roadSvg" aria-hidden="true">
        <path className="r-edge" strokeWidth="128" />
        <path className="r-asphalt" strokeWidth="116" />
        <path className="r-center" id="roadAsphalt" strokeWidth="5" strokeDasharray="22 26" />
      </svg>
      <div className="stop-layer" id="stopLayer" />

      <div className="bus-ping" id="busPing" />
      <div id="bus" aria-hidden="true">
        <svg viewBox="0 0 64 120" xmlns="http://www.w3.org/2000/svg">
          <rect className="bus-stripe" x="0" y="26" width="8" height="5" rx="2.5" />
          <rect className="bus-stripe" x="56" y="26" width="8" height="5" rx="2.5" />
          <rect className="bus-wheel" x="3" y="34" width="4" height="15" rx="2" />
          <rect className="bus-wheel" x="57" y="34" width="4" height="15" rx="2" />
          <rect className="bus-wheel" x="3" y="74" width="4" height="15" rx="2" />
          <rect className="bus-wheel" x="57" y="74" width="4" height="15" rx="2" />
          <rect className="bus-body" x="6" y="5" width="52" height="110" rx="22" stroke="rgba(10,30,40,.10)" strokeWidth="1" />
          <rect className="bus-roof" x="12" y="22" width="40" height="74" rx="16" />
          <path className="bus-glass" d="M14 19 Q32 9 50 19 L50 25 Q32 17 14 25 Z" />
          <rect className="bus-glass" x="16" y="99" width="32" height="11" rx="6" opacity=".5" />
          <rect className="bus-stripe" x="6" y="60" width="52" height="6" opacity=".9" />
          <circle className="bus-lidar" cx="32" cy="41" r="8" />
          <circle cx="32" cy="41" r="3.4" fill="#06323d" />
          <path className="bus-stripe" d="M28 14 l4 -3 l4 3 Z" />
        </svg>
      </div>
    </>
  )
}
