import { useNavigate } from "react-router-dom";
import { Film, BarChart3, FileText, ArrowRight } from "lucide-react";

const features = [
  { icon: Film, title: "쇼츠 자동 제작", desc: "AI가 하이라이트를 찾고 쇼츠를 만듭니다" },
  { icon: BarChart3, title: "데이터 분석", desc: "콘텐츠 성과를 한눈에 파악합니다" },
  { icon: FileText, title: "문서 자동화", desc: "반복 업무를 자동으로 처리합니다" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#6C3FC5]/8 blur-[160px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo */}
          <h1 className="text-lg tracking-[0.4em] font-bold text-white/60 mb-16 uppercase">
            ENTIUS
          </h1>

          {/* Main title */}
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black leading-[1.05] tracking-tight mb-8">
            콘텐츠의 흐름을
            <br />
            <span className="text-[#6C3FC5]">바꾸다</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/40 max-w-lg mb-14 font-light leading-relaxed">
            AI가 분석하고, 자동으로 제작하고, 한번에 완성
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 bg-[#6C3FC5] hover:bg-[#5a32a8] text-white px-10 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,63,197,0.4)]"
          >
            지금 시작하기
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-32 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-3xl mx-auto w-full">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-[#6C3FC5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90 mb-1">{f.title}</p>
                <p className="text-xs text-white/30 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>
    </div>
  );
};

export default Landing;
