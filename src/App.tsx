import React, { useState, useEffect } from 'react';
import { Key, Info, ExternalLink, Wrench, Search, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState('');

  const handleSearch = async () => {
    if (!companyName.trim()) {
      alert('기업명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setIsCompleted(false);
    setProgress(10);
    setResult('');

    try {
      // 사용자 요청에 따라 특정 API Key를 하드코딩하여 인증 없이 사용 가능하도록 설정
      // 주의: 보안을 위해 실제 운영 환경에서는 환경 변수 사용을 권장합니다.
      const API_KEY = "AIzaSyDVCfg17Ki69e-t08ATaPL4kkUgve9IyHo";
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      setProgress(30);

      const COACHES_DATA = [
        { name: "윤호상 코치", url: "https://coachingpass.co.kr/yhs", region: "[선호지역] 대구, [가능지역] 부산" },
        { name: "문창준 코치님", url: "https://coachingpass.co.kr/mcj", region: "[선호지역] 경기도 고양시, 경기도 일산시 [가능지역] 서울 종로, 서울 신촌" },
        { name: "이윤호 코치님", url: "https://coachingpass.co.kr/yhl", region: "[선호지역] 서울 대학로, [가능지역] 서울 종로, 신촌, 미아역 부근" },
        { name: "김치성 코치님", url: "https://coachingpass.co.kr/kcs", region: "[선호지역] 서울 방이역 부근, [가능지역] 서울 강남, 종로" },
        { name: "조민근 코치님", url: "https://coachingpass.co.kr/cmg", region: "[선호지역] 서울 신촌, [가능지역] 서울 종로, 강남" },
        { name: "유영식 코치님", url: "https://coachingpass.co.kr/yys", region: "[선호지역] 서울 영등포, [가능지역] 경기도남부(수원,안양,부천), 경기서부(성남)" },
        { name: "이철민 코치님", url: "https://coachingpass.co.kr/cml", region: "[선호지역] 서울 홍대, [가능지역] 서울 종로" },
        { name: "정혜은 코치님", url: "https://coachingpass.co.kr/hej", region: "[선호지역] 서울 종로, [가능지역] 서울 강남" },
        { name: "이종현 코치님", url: "https://coachingpass.co.kr/ljh", region: "[선호지역] 양산, [가능지역] 부산" },
        { name: "이로운 코치님", url: "https://coachingpass.co.kr/lru", region: "[선호지역] 부산, [가능지역] 부산" },
        { name: "김경재 코치님", url: "https://coachingpass.co.kr/kjk", region: "[선호지역] 경기도 일산, [가능지역] 서울 신촌, 합정, 홍대, 경기도 고양, 서부, 북부" },
        { name: "김은아 코치님", url: "https://coachingpass.co.kr/eak", region: "[선호지역] 대전, [가능지역] 서울역, 영등포역" },
        { name: "권규청 코치님", url: "https://coachingpass.co.kr/kkc", region: "[선호지역 및 가능지역] 경기도 광주" },
        { name: "성정인 코치님", url: "https://coachingpass.co.kr/jis", region: "[선호지역 및 가능지역] 대구" },
        { name: "김태성 코치님", url: "https://coachingpass.co.kr/tsk", region: "[선호지역 및 가능지역] 서울 종로" },
        { name: "강경원 코치님", url: "https://coachingpass.co.kr/kwk", region: "[선호지역 및 가능지역] 비대면" },
        { name: "이동현 코치님", url: "https://coachingpass.co.kr/dhl", region: "[선호지역 및 가능지역] 서울 강남, 경기도 성남, 분당, 수원" },
        { name: "최지혜 코치님", url: "https://coachingpass.co.kr/jhc", region: "[선호지역] 경기도 고양, [가능지역] 서울 강서구, 은평구" },
        { name: "노영우 코치님", url: "https://coachingpass.co.kr/nyw", region: "[선호지역] 서울 종로, 광화문, 명동 [가능지역] 서울 신촌, 이대, 혜화, 대학로" },
        { name: "김항기 코치님", url: "https://coachingpass.co.kr/khk", region: "[선호지역] 서울 종로, [가능지역] 서울 강남" },
        { name: "김정규 코치님", url: "https://coachingpass.co.kr/jkk", region: "[선호지역] 서울 고속터미널, 강남 [가능지역] 세종, 대전, 청주" },
        { name: "박래옥 코치님", url: "https://coachingpass.co.kr/pro", region: "[선호지역 및 가능지역] 서울 혜화" },
        { name: "이인준 코치님", url: "https://coachingpass.co.kr/ijl", region: "[선호지역] 경기도 동탄, [가능지역] 서울 강남, 경기 남부, 천안, 화성, 안양, 수원, 분당" },
        { name: "양희성 코치님", url: "https://coachingpass.co.kr/hsybusiness", region: "[선호지역] 서울 종로, 노량진, [가능지역] 서울 강남, 경기도 일산" },
        { name: "임태성 코치님", url: "https://coachingpass.co.kr/lts", region: "[선호지역 및 가능지역] 서울 강남" },
        { name: "박승우 코치님", url: "https://coachingpass.co.kr/swp", region: "[선호지역 및 가능지역] 충청북도 청주, 비대면" },
        { name: "송병민 코치님", url: "https://coachingpass.co.kr/sbm", region: "[선호지역 및 가능지역] 부산 해운대 마린시티" },
        { name: "김혜연 코치님", url: "https://coachingpass.co.kr/hyk", region: "[선호지역] 서울 강남, 경기도 분당, 경기도 광주 [가능지역] 서울 종로" },
        { name: "신혜경 코치님", url: "https://coachingpass.co.kr/shk", region: "[선호지역 및 가능지역] 부산" },
        { name: "정휘성 코치님", url: "https://coachingpass.co.kr/jhs", region: "[선호지역 및 가능지역] 부산" }
      ];

      const BATCH_SIZE = 1; // 개별 코치별로 즉시 병렬 분석하여 속도 극대화
      const batches = [];
      for (let i = 0; i < COACHES_DATA.length; i += BATCH_SIZE) {
        batches.push(COACHES_DATA.slice(i, i + BATCH_SIZE));
      }

      setProgress(50);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const results = new Array(batches.length).fill("");

      let lastUpdateTime = 0;
      const updateUI = (force = false) => {
        const now = Date.now();
        // 실시간 업데이트를 위해 지연 시간 단축
        if (!force && now - lastUpdateTime < 100) return;
        lastUpdateTime = now;

        let combined = "맞춤 코치 조회 결과:\n\n";
        let hasContent = false;
        
        results.forEach(res => {
          let display = res.trim();
          if (display === "P" || display === "PA" || display === "PAS" || display === "PASS") {
            display = "";
          } else {
            display = display.replace(/PASS/g, '').trim();
          }
          
          if (display) {
            combined += display + "\n\n";
            hasContent = true;
          }
        });

        if (hasContent) {
          setResult(combined.trim());
        }
      };

      const systemInstruction = `당신은 코치 웹사이트 텍스트 검증 AI입니다.
[최고 수준의 경고 및 절대 규칙]
1. 제공된 URL의 "웹사이트 본문 텍스트"를 직접 읽고 검사하세요.
2. 맞춤 코치 조회시 입력된 기업("${companyName}")이 해당 코치의 웹사이트에 무조건 작성되어있을 경우만 분석 결과로 출력합니다. 해당 기업이 없는 코치들은 절대 분석 결과에 출력하지 않습니다.
3. [명확한 예시 기준]: 예를 들어, 기업에 '삼성전자'가 입력되고 맞춤 코치 조회를 할 경우 '삼성전자'가 웹사이트에 정확히 작성되어있는 코치들만 분석 결과에 출력되어야 합니다. 삼성전자뿐만 아니라 모든 기업("${companyName}")이 동일하게 적용되어야 합니다.
4. 코치의 이름, 기존 지식, URL 주소만으로 기업명이 있다고 추측하거나 지어내면(할루시네이션) 절대 안 됩니다.
5. 오직 크롤링된 텍스트 내에 "${companyName}"이 100% 일치하게 적혀 있는 코치만 결과에 남기세요.
6. 조건에 맞는 코치가 한 명도 없다면 오직 "PASS"만 출력하세요.
7. 조건에 맞는 코치가 있다면 아래 형식으로만 출력하세요. 코치가 여러 명일 경우 반드시 각 코치 사이에 빈 줄(엔터 두 번)을 넣어 문단을 명확히 구분하세요:
[코치 이름] URL
지역: [코치별 가능 지역]

[다음 코치 이름] URL
지역: [다음 코치별 가능 지역] (이런 식으로 코치마다 문단을 분리하여 배치하세요)`;

      const fetchAndProcess = async (batch: any[], index: number) => {
        const listStr = batch.map(c => `- [${c.name}] ${c.url}\n  지역: ${c.region}`).join('\n');
        const prompt = `[검색할 기업명]: "${companyName}"\n\n[초강력 경고]\n맞춤 코치 조회시 입력된 기업이 해당 코치의 웹사이트에 무조건 작성되어있을 경우만 분석 결과로 출력합니다. 해당 기업이 없는 코치들은 절대 분석 결과에 출력하지 않습니다.\n예를 들어, 기업에 '삼성전자'가 입력되고 맞춤 코치 조회를 할 경우 '삼성전자'가 웹사이트에 정확히 작성되어있는 코치들만 분석 결과에 출력되어야 합니다. 삼성전자뿐만 아니라 모든 기업이 동일하게 적용되어야 합니다.\nURL 접속 불가, 텍스트 크롤링 실패, 텍스트 내 기업명 미발견 시 해당 코치는 무조건 제외(Skip)하세요.\n\n[코치 목록]\n${listStr}`;
        
        const stream = await ai.models.generateContentStream({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: { 
            systemInstruction,
            temperature: 0,
            topK: 1,
            tools: [{ urlContext: {} }] 
          }
        });
        for await (const chunk of stream) {
          results[index] += chunk.text;
          updateUI();
        }
      };

      // 모든 배치를 병렬로 처리하여 속도 개선
      // Promise.allSettled를 사용하여 일부 실패하더라도 나머지는 진행되도록 함
      const settledResults = await Promise.allSettled(batches.map((batch, i) => fetchAndProcess(batch, i)));
      
      // 모든 요청이 실패했는지 확인 (전부 실패 시 에러 처리)
      const allFailed = settledResults.every(r => r.status === 'rejected');
      if (allFailed) {
        const firstError = (settledResults[0] as PromiseRejectedResult).reason;
        throw firstError;
      }
      
      updateUI(true); // 모든 스트림 완료 후 강제 UI 업데이트

      clearInterval(progressInterval);
      setProgress(100);

      let finalCombined = "";
      results.forEach(res => {
        let finalRes = res.trim();
        if (finalRes === "P" || finalRes === "PA" || finalRes === "PAS" || finalRes === "PASS") {
          finalRes = "";
        } else {
          finalRes = finalRes.replace(/PASS/g, '').trim();
        }
        if (finalRes) finalCombined += finalRes + "\n\n";
      });

      if (finalCombined.trim() === "") {
        setResult("해당 기업과 관련된 맞춤 코치 조회 결과를 찾을 수 없습니다.");
        setIsCompleted(false); // 결과가 없을 때는 완료 배너를 표시하지 않음
      } else {
        setResult("맞춤 코치 조회 결과:\n\n" + finalCombined.trim());
        setIsCompleted(true);
      }
    } catch (error: any) {
      console.error(error);
      let errorMessage = "오류가 발생했습니다. API Key가 유효한지 확인해주세요.";
      
      if (error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMessage = "API 사용량 한도를 초과했습니다 (429 Error). 잠시 후 다시 시도하거나, Google AI Studio에서 API 할당량 및 결제 정보를 확인해주세요.";
      }
      
      setResult(errorMessage);
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900 selection:bg-neutral-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-40 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Info className="w-5 h-5" />
            <span className="hidden sm:inline">사용방법</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-medium text-neutral-500 hidden sm:block">
            개발자: 정혁신
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-24">
        {/* Hero Image */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video sm:aspect-[21/9] md:aspect-[16/9] max-h-[400px] overflow-hidden bg-black">
          {/* Gold & Black Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1813] to-[#000000]"></div>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #D4AF37 0%, transparent 60%)' }}></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #ffffff 0%, transparent 50%)' }}></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9F295] via-[#D4AF37] to-[#B8860B]">코칭패스</span> 맞춤 코치 조회 AI
            </h1>
            <p className="mt-4 text-neutral-200 text-sm sm:text-base max-w-2xl drop-shadow-md font-light">
              기업명을 입력하시면 최적의 코치를 정밀 분석하여 추천해 드립니다.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-neutral-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="기업명을 입력하세요 (예: 삼성전자, 현대자동차)"
                  className="block w-full pl-11 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !companyName.trim()}
                className="flex items-center justify-center px-8 py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? '조회 중...' : '맞춤 코치 조회'}
              </button>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
              {isLoading && !result && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="flex justify-between text-sm font-medium text-neutral-600 mb-2">
                    <span>데이터 분석 및 크롤링 진행 중...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      className="bg-neutral-900 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completion Banner */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-3 text-green-800 shadow-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </motion.div>
                  <span className="font-bold text-lg">조회가 완료되었습니다!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result Section */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    분석 결과
                  </h3>
                  <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap select-none">
                    {result.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                      if (part.match(/(https?:\/\/[^\s]+)/g)) {
                        let cleanUrl = part;
                        let trailing = '';
                        if (/[.,;)?!]$/.test(part)) {
                          trailing = part.slice(-1);
                          cleanUrl = part.slice(0, -1);
                        }
                        return (
                          <React.Fragment key={index}>
                            <a 
                              href={cleanUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              {cleanUrl}
                            </a>
                            {trailing}
                          </React.Fragment>
                        );
                      }
                      return <span key={index}>{part}</span>;
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Left Branding */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-0.5 ml-1">
            Success Key
          </span>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-4 py-2 bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-lg flex items-center gap-2">
              <Key className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F9F295] via-[#D4AF37] to-[#B8860B] drop-shadow-sm">
                합격의 열쇠 코칭패스
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Right Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 items-end">
        <a 
          href="https://coachingpass.co.kr/consulting" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative group flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-[#D4AF37] via-[#C5A017] to-[#B8860B] text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F9F295] to-[#D4AF37] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse"></div>
          <MessageCircle className="w-5 h-5 relative z-10" />
          <span className="font-bold text-[15px] relative z-10 tracking-wide drop-shadow-md">코칭패스 빠른상담신청하기</span>
          <Sparkles className="w-4 h-4 relative z-10 text-[#F9F295] absolute top-2 right-4 animate-pulse" />
        </a>
        <a 
          href="https://coachingpass.co.kr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-white text-neutral-900 rounded-full shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-all group w-fit"
        >
          <span className="font-medium text-sm">코칭패스 홈페이지 바로가기</span>
          <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 transition-colors" />
        </a>
        <button 
          onClick={() => setIsInquiryOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 transition-all w-fit"
        >
          <Wrench className="w-4 h-4" />
          <span className="font-medium text-sm">오류/유지보수 문의</span>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Help Modal */}
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900">사용방법</h2>
                <button onClick={() => setIsHelpOpen(false)} className="text-neutral-400 hover:text-neutral-900">
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-900">1</div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">API Key 자동 적용</h4>
                      <p className="text-sm text-neutral-600">API Key는 자동 적용되어 있습니다. 별도의 등록 절차 없이 바로 조회가 가능합니다.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-900">2</div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">기업명 입력</h4>
                      <p className="text-sm text-neutral-600">조회하고자 하는 기업명(예: 삼성전자, 카카오 등)을 입력창에 작성합니다.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-900">3</div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">맞춤 코치 조회</h4>
                      <p className="text-sm text-neutral-600">조회 버튼을 클릭하면 AI가 대상 사이트를 정밀 분석하여 적합한 코치를 추천해 드립니다.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-900">4</div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">로딩 지연 시 안내</h4>
                      <p className="text-sm text-neutral-600">조회 시 1분 이상 로딩이 지속될 경우 일시적 오류일 수 있으니, 페이지 새로고침 후 다시 조회하시면 정상적으로 진행됩니다.</p>
                    </div>
                  </li>
                </ol>
                <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-xs text-neutral-500 text-center">
                    본 서비스는 지속적으로 업데이트되며, 사용방법 또한 최신 기능에 맞게 자동 업데이트됩니다.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Inquiry Modal */}
        {isInquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  오류/유지보수 문의
                </h2>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-6">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    업데이트나 유지보수가 필요할 경우 아래 이메일로 어떤 부분이 필요한지 상세하게 작성 후 보내주세요.
                  </p>
                  <div className="mt-4 font-mono text-sm font-medium text-neutral-900 bg-white px-3 py-2 rounded-lg border border-neutral-200 inline-block">
                    info@nextin.ai.kr
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsInquiryOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
