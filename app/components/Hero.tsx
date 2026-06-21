function FeltFlower({
  cx,
  cy,
  radius = 60,
  petals = 6,
  color,
  centerColor,
  rotate = 0,
}: {
  cx: number;
  cy: number;
  radius?: number;
  petals?: number;
  color: string;
  centerColor: string;
  rotate?: number;
}) {
  const petalEls = Array.from({ length: petals }).map((_, i) => {
    const angle = (360 / petals) * i + rotate;
    return (
      <ellipse
        key={i}
        cx={cx}
        cy={cy - radius * 0.55}
        rx={radius * 0.34}
        ry={radius * 0.58}
        fill={color}
        stroke="#2B231D"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  });
  return (
    <g>
      {petalEls}
      <circle
        cx={cx}
        cy={cy}
        r={radius * 0.22}
        fill={centerColor}
        stroke="#2B231D"
        strokeOpacity="0.15"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
    </g>
  );
}

function FeltLeaf({
  x,
  y,
  width = 26,
  height = 60,
  rotate = 0,
  color,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotate?: number;
  color: string;
}) {
  return (
    <path
      d={`M ${x} ${y} Q ${x + width} ${y + height / 2} ${x} ${y + height} Q ${x - width} ${y + height / 2} ${x} ${y} Z`}
      fill={color}
      stroke="#2B231D"
      strokeOpacity="0.15"
      strokeWidth="1.5"
      strokeDasharray="4 3"
      transform={`rotate(${rotate} ${x} ${y + height / 2})`}
    />
  );
}

function FeltBouquet({ className = "" }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Illustratie van een boeket vilten bloemen"
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .felt-sway { animation: felt-sway 6s ease-in-out infinite; transform-origin: 210px 380px; }
          .felt-sway-delay { animation-delay: -3s; }
          @keyframes felt-sway {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
          }
        }
      `}</style>

      <path
        d="M210 380 C 200 300, 220 260, 150 190"
        fill="none"
        stroke="#7E8E70"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M210 380 C 215 300, 195 250, 260 170"
        fill="none"
        stroke="#7E8E70"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M210 380 C 210 310, 210 270, 210 140"
        fill="none"
        stroke="#7E8E70"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <g className="felt-sway">
        <FeltLeaf
          x={175}
          y={300}
          width={26}
          height={60}
          rotate={-20}
          color="#9CAE8C"
        />
        <FeltLeaf
          x={245}
          y={290}
          width={26}
          height={60}
          rotate={25}
          color="#7E8E70"
        />
      </g>

      <g className="felt-sway felt-sway-delay">
        <FeltFlower
          cx={150}
          cy={190}
          radius={58}
          petals={6}
          color="#D98B86"
          centerColor="#D9A441"
          rotate={10}
        />
      </g>
      <g className="felt-sway">
        <FeltFlower
          cx={260}
          cy={170}
          radius={50}
          petals={5}
          color="#C2654B"
          centerColor="#FAF6EE"
          rotate={0}
        />
      </g>
      <g className="felt-sway felt-sway-delay">
        <FeltFlower
          cx={210}
          cy={140}
          radius={66}
          petals={7}
          color="#E3A8A0"
          centerColor="#7E8E70"
          rotate={-8}
        />
      </g>
    </svg>
  );
}

export default function Hero({ appT }: { appT: (key: string) => string }) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .fade-up { animation: fade-up .7s ease-out both; }
          .fade-up-d1 { animation-delay: .1s; }
          .fade-up-d2 { animation-delay: .2s; }
          .fade-up-d3 { animation-delay: .3s; }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>

      {/* subtle felt grain texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 md:gap-10 md:px-10">
        {/* Copy */}
        <div className="order-2 md:order-1">
          <span className="fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-[#C2654B]/30 bg-[#C2654B]/10 px-4 py-1.5 text-sm font-medium tracking-wide text-secondary-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            {appT("handmade")}
          </span>

          <h1
            className="fade-up fade-up-d1 text-5xl font-semibold leading-[1.05] tracking-tight text-[#2B231D] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {appT("title")}
          </h1>

          <h3 className="fade-up fade-up-d2 mt-6 max-w-md text-xl leading-relaxed text-[#5B5247]">
            {appT("description")}
          </h3>

          <div className="fade-up fade-up-d3 mt-10 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-primary px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/20 transition hover:bg-primary/60 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              {appT("shop")}
            </button>
            <button className="rounded-full border border-[#2B231D]/15 px-8 py-3.5 text-base font-medium text-[#2B231D] transition hover:border-[#2B231D]/30 hover:bg-[#2B231D]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B231D]/40 focus-visible:ring-offset-2">
              {appT("about")}
            </button>
          </div>
        </div>

        {/* Signature illustration */}
        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <FeltBouquet className="h-70 w-70 sm:h-95 sm:w-95 md:h-120 md:w-120" />
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[#2B231D]/30">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 7l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
