import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Crown, Trophy, Medal, Award } from 'lucide-react';
import './App.css';

interface Submission {
  id: string;
  github_url: string;
  repo_name: string;
  owner: string;
  score: string | number;
  submitted_at: string;
}

export default function App() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('00:00:00');
  const [animate, setAnimate] = useState(false);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  const currentUserRepo = (import.meta.env.VITE_CURRENT_USER_REPO || '').toLowerCase().trim();

  // Parse tags client-side from repo names
  const getTag = (repoName: string = '') => {
    const name = repoName.toLowerCase();
    if (name.includes('bot') || name.includes('chat') || name.includes('agent') || name.includes('model') || name.includes('ai') || name.includes('llm') || name.includes('gpt')) {
      return 'AI';
    }
    if (name.includes('web') || name.includes('app') || name.includes('portal') || name.includes('site') || name.includes('front')) {
      return 'WEB';
    }
    if (name.includes('api') || name.includes('server') || name.includes('backend') || name.includes('db')) {
      return 'API';
    }
    return 'DEV';
  };

  const fetchStandings = async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('submissions')
        .select('*')
        .order('score', { ascending: false });

      if (dbError) throw dbError;
      
      setSubmissions(data || []);
      setSecondsSinceUpdate(0);
      setError(null);
    } catch (err: any) {
      console.error('Error syncing standings:', err.message);
      setError(err.message || 'Failed to sync with Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  // Animate the bar fills on every data load
  useEffect(() => {
    if (submissions.length > 0) {
      setAnimate(false);
      const t = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(t);
    }
  }, [submissions]);

  // Real-time subscription & fallback polling
  useEffect(() => {
    fetchStandings();

    // Polling every 10 seconds as requested
    const pollInterval = setInterval(() => {
      fetchStandings();
    }, 10000);

    // Supabase Real-time
    const channel = supabase
      .channel('realtime_submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        fetchStandings();
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Timer countdown hook
  useEffect(() => {
    const endTimeStr = import.meta.env.VITE_HACKATHON_END_TIME || '2026-12-01T18:00:00Z';
    const endTime = new Date(endTimeStr).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }

      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      const formatted = [
        String(hrs).padStart(2, '0'),
        String(mins).padStart(2, '0'),
        String(secs).padStart(2, '0')
      ].join(':');

      setCountdown(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Tracking seconds since last update
  useEffect(() => {
    const updateTick = setInterval(() => {
      setSecondsSinceUpdate(s => s + 1);
    }, 1000);
    return () => clearInterval(updateTick);
  }, []);

  const totalSubmissions = submissions.length;
  const topScore = totalSubmissions > 0
    ? Math.max(...submissions.map(s => parseFloat(s.score as string)))
    : 100;

  const podium = submissions.slice(0, 3);
  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  const renderPodiumCard = (submission: Submission, position: number, label: string) => {
    const scoreNum = parseFloat(submission.score as string);
    const tag = getTag(submission.repo_name);

    let cardBorder = '1px solid var(--br)';
    let cardBorderTop = '2px solid var(--br2)';
    let cardBgImage = 'none';
    let scoreColor = 'var(--cream)';
    let badgeBg = '';
    let badgeBorder = '';
    let badgeIcon = null;
    let badgeText = '';
    let labelColor = 'var(--cream3)';

    if (position === 1) {
      cardBorder = '1px solid rgba(255, 179, 0, 0.4)';
      cardBorderTop = '2px solid #ffb300';
      cardBgImage = 'linear-gradient(180deg, rgba(255, 179, 0, 0.08) 0%, var(--s1) 60%)';
      scoreColor = '#ffb300';
      labelColor = '#ffb300';
      badgeBg = 'linear-gradient(135deg, #ffe082, #ffb300)';
      badgeBorder = '1px solid #ffd54f';
      badgeIcon = <Crown size={12} style={{ color: '#000000', fill: '#000000' }} />;
      badgeText = '1st Place';
    } else if (position === 2) {
      cardBorder = '1px solid rgba(224, 224, 224, 0.3)';
      cardBorderTop = '2px solid #b0bec5';
      cardBgImage = 'linear-gradient(180deg, rgba(224, 224, 224, 0.05) 0%, var(--s1) 60%)';
      scoreColor = '#ffffff';
      labelColor = '#cfd8dc';
      badgeBg = 'linear-gradient(135deg, #ffffff, #b0bec5)';
      badgeBorder = '1px solid #cfd8dc';
      badgeIcon = <Trophy size={12} style={{ color: '#000000', fill: '#000000' }} />;
      badgeText = '2nd Place';
    } else if (position === 3) {
      cardBorder = '1px solid rgba(255, 171, 64, 0.3)';
      cardBorderTop = '2px solid #ffab40';
      cardBgImage = 'linear-gradient(180deg, rgba(255, 171, 64, 0.05) 0%, var(--s1) 60%)';
      scoreColor = '#ffab40';
      labelColor = '#ffd180';
      badgeBg = 'linear-gradient(135deg, #ffd180, #ffab40)';
      badgeBorder = '1px solid #ffe0b2';
      badgeIcon = <Award size={12} style={{ color: '#000000', fill: '#000000' }} />;
      badgeText = '3rd Place';
    }

    return (
      <div 
        style={{
          background: 'var(--s1)',
          border: cardBorder,
          borderTop: cardBorderTop,
          borderRadius: '8px',
          padding: '28px 16px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: cardBgImage,
          position: 'relative'
        }}
      >
        {/* Floating badge */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          background: badgeBg,
          border: badgeBorder,
          color: '#000000',
          borderRadius: '20px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }} className="font-mono-custom">
          {badgeIcon}
          <span>{badgeText}</span>
        </div>

        <span 
          className="font-mono-custom" 
          style={{ 
            fontSize: '9px', 
            textTransform: 'uppercase', 
            letterSpacing: '.14em', 
            color: labelColor,
            marginBottom: '12px',
            marginTop: '4px'
          }}
        >
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2px' }}>
          <span 
            className="font-mono-custom" 
            style={{ 
              fontSize: '42px', 
              fontWeight: 700, 
              color: scoreColor,
              lineHeight: 1
            }}
          >
            {scoreNum.toFixed(1)}
          </span>
        </div>
        <span className="font-mono-custom" style={{ fontSize: '10px', color: 'var(--dim)', marginBottom: '16px' }}>/ 100</span>
        <h3 className="font-sans-custom" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cream)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
          {submission.repo_name}
        </h3>
        <span className="font-mono-custom" style={{ fontSize: '10px', color: 'var(--cream3)', marginBottom: '12px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
          @{submission.owner}
        </span>
        <div 
          className="font-mono-custom"
          style={{ 
            fontSize: '9px', 
            textTransform: 'uppercase', 
            borderRadius: '2px', 
            padding: '2px 6px',
            background: tag === 'AI' ? 'rgba(255, 107, 43, 0.1)' : 'var(--s2)',
            border: tag === 'AI' ? '1px solid rgba(255, 107, 43, 0.25)' : '1px solid var(--br)',
            color: tag === 'AI' ? 'var(--orange)' : 'var(--cream3)',
            display: 'inline-block'
          }}
        >
          {tag}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
      {/* Background elements */}
      <div className="glow-top-right" />
      <div className="glow-bottom-left" />
      <div className="center-line" />

      <main style={{ flex: 1, width: '100%', maxWidth: '820px', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 10 }}>
        
        {/* Section 1 - Nav Bar */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--br)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', border: '1px solid var(--orange)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: 'var(--orange)' }} className="font-mono-custom">
              ⌬
            </div>
            <span className="font-sans-custom" style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--cream)' }}>
              HackArena
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255, 107, 43, 0.3)', background: 'rgba(255, 107, 43, 0.06)', padding: '4px 8px', borderRadius: '4px' }}>
              <span className="pulse-dot" style={{ display: 'inline-flex', height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--orange)' }} />
              <span className="font-mono-custom" style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--orange)', letterSpacing: '0.05em' }}>LIVE</span>
            </div>
            {/* Timer badge */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--br2)', background: 'var(--s2)', padding: '4px 8px', borderRadius: '4px' }}>
              <span className="font-mono-custom" style={{ fontSize: '10px', color: 'var(--cream3)' }}>{countdown}</span>
            </div>
          </div>
        </nav>

        {/* Section 2 - Hero Block */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', border: '1px solid var(--br2)', borderRadius: '2px', padding: '2px 8px', marginBottom: '16px' }}>
            <span className="font-mono-custom" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--cream3)' }}>
              Rankings
            </span>
          </div>
          <h1 className="font-sans-custom" style={{ fontSize: '72px', fontWeight: 700, letterSpacing: '-3px', lineHeight: 0.95, margin: '0 0 16px 0' }}>
            <div style={{ color: 'var(--white)' }}>The</div>
            <div style={{ WebkitTextStroke: '1px rgba(255,248,240,.15)', WebkitTextFillColor: 'transparent' }}>scoreboard</div>
            <div style={{ color: 'var(--orange)', fontStyle: 'italic', letterSpacing: '-2px' }}>burns.</div>
          </h1>
          <p className="font-mono-custom" style={{ fontSize: '11px', color: 'var(--cream3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            LIVE · AUTO-UPDATES · NO MERCY
          </p>
        </section>

        {error && (
          <div className="font-mono-custom" style={{ background: 'rgba(255, 45, 85, 0.08)', border: '1px solid var(--red)', borderRadius: '4px', padding: '12px', color: 'var(--red)', fontSize: '11px', marginBottom: '24px' }}>
            SYNC ERROR: {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
            <div className="pulse-dot" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--orange)' }} />
            <p className="font-mono-custom" style={{ color: 'var(--cream3)', fontSize: '10px', letterSpacing: '0.1em' }}>LOADING ENGINE STREAM...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '240px', gap: '8px', border: '1px solid var(--br)', borderRadius: '8px', background: 'var(--s1)' }}>
            <p className="font-sans-custom" style={{ color: 'var(--cream2)', fontSize: '14px', fontWeight: 600 }}>The board is cold.</p>
            <p className="font-mono-custom" style={{ color: 'var(--dim)', fontSize: '10px' }}>Waiting for the first repository evaluations.</p>
          </div>
        ) : (
          <>
            {/* Section 3 - Divider "Top 3" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--br)' }} />
              <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.14em' }}>Top 3</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--br)' }} />
            </div>

            {/* Section 4 - Podium */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: '8px', marginBottom: '32px' }}>
              {/* 2nd Place */}
              {second ? renderPodiumCard(second, 2, 'Runner up') : (
                <div style={{ background: 'transparent', border: '1px dashed var(--br)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)' }}>EMPTY SLOT</span>
                </div>
              )}

              {/* 1st Place */}
              {first ? renderPodiumCard(first, 1, 'Champion') : (
                <div style={{ background: 'transparent', border: '1px dashed var(--br)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)' }}>EMPTY SLOT</span>
                </div>
              )}

              {/* 3rd Place */}
              {third ? renderPodiumCard(third, 3, 'Third') : (
                <div style={{ background: 'transparent', border: '1px dashed var(--br)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)' }}>EMPTY SLOT</span>
                </div>
              )}
            </section>

            {/* Section 5 - Divider "Full Board" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--br)' }} />
              <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '.14em' }}>Full board</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--br)' }} />
            </div>

            {/* Section 6 - Column Header Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 120px 72px', gap: '12px', padding: '10px 16px', borderBottom: '1px solid var(--br)', marginBottom: '8px' }}>
              <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '.12em' }}>RANK</span>
              <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '.12em' }}>PROJECT</span>
              <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '.12em' }}>SCORE</span>
              <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', letterSpacing: '.12em', textAlign: 'right' }}>PTS</span>
            </div>

            {/* Section 7 - Leaderboard Rows (Ranks 4 onwards) */}
            <section style={{ marginBottom: '24px' }}>
              {submissions.slice(3).length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--dim)', fontSize: '10px' }} className="font-mono-custom">
                  No additional rankings below Top 3.
                </div>
              ) : (
                submissions.slice(3).map((submission, index) => {
                  const rankNum = index + 4;
                  const scoreNum = parseFloat(submission.score as string);
                  const pctOfTop = topScore > 0 ? ((scoreNum / topScore) * 100).toFixed(0) : '0';
                  
                  const cleanGithubUrl = submission.github_url.toLowerCase().trim();
                  const isCurrentUser = cleanGithubUrl.includes(currentUserRepo) && currentUserRepo !== '';

                  const tag = getTag(submission.repo_name);
                  const delay = index * 30; // 30ms stagger

                  // Custom styles for other ranks
                  let rankColor = 'var(--dim)';
                  let rankBg = 'transparent';
                  let rankBorder = '1px solid transparent';
                  
                  if (rankNum === 4 || rankNum === 5) {
                    rankColor = '#10b981'; // Emerald Green
                    rankBg = 'rgba(16, 185, 129, 0.08)';
                    rankBorder = '1px solid rgba(16, 185, 129, 0.25)';
                  } else if (rankNum >= 6 && rankNum <= 10) {
                    rankColor = '#3b82f6'; // Electric Blue
                    rankBg = 'rgba(59, 130, 246, 0.08)';
                    rankBorder = '1px solid rgba(59, 130, 246, 0.25)';
                  } else if (rankNum >= 11 && rankNum <= 20) {
                    rankColor = '#8b5cf6'; // Amethyst Purple
                    rankBg = 'rgba(139, 92, 246, 0.08)';
                    rankBorder = '1px solid rgba(139, 92, 246, 0.25)';
                  } else {
                    rankColor = 'var(--cream3)'; // Contender Silver/Gray
                    rankBg = 'rgba(160, 144, 128, 0.05)';
                    rankBorder = '1px solid rgba(160, 144, 128, 0.15)';
                  }

                  return (
                    <div 
                      key={submission.id}
                      className="animate-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px minmax(0,1fr) 120px 72px',
                        gap: '12px',
                        background: 'var(--s1)',
                        border: isCurrentUser ? '1px solid rgba(255,107,43,.3)' : '1px solid var(--br)',
                        backgroundImage: isCurrentUser ? 'linear-gradient(90deg, rgba(255,107,43,.03) 0%, transparent 100%)' : 'none',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        alignItems: 'center',
                        marginBottom: '8px',
                        animationDelay: `${delay}ms`
                      }}
                      onMouseOver={(e) => {
                        const target = e.currentTarget;
                        target.style.borderColor = 'var(--br2)';
                        target.style.background = 'var(--s2)';
                      }}
                      onMouseOut={(e) => {
                        const target = e.currentTarget;
                        target.style.borderColor = isCurrentUser ? 'rgba(255,107,43,.3)' : 'var(--br)';
                        target.style.background = isCurrentUser ? 'rgba(255,107,43,.03)' : 'var(--s1)';
                      }}
                    >
                      {/* Rank */}
                      <div 
                        className="font-mono-custom" 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: 700, 
                          color: rankColor, 
                          textAlign: 'center',
                          background: rankBg,
                          border: rankBorder,
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto'
                        }}
                      >
                        {String(rankNum).padStart(2, '0')}
                      </div>

                      {/* Project Info */}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                          <span className="font-sans-custom" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cream)' }}>
                            {submission.repo_name}
                          </span>
                          <span 
                            className="font-mono-custom"
                            style={{ 
                              fontSize: '8px', 
                              textTransform: 'uppercase', 
                              borderRadius: '2px', 
                              padding: '1px 4px',
                              background: tag === 'AI' ? 'rgba(255, 107, 43, 0.1)' : 'var(--s2)',
                              border: tag === 'AI' ? '1px solid rgba(255, 107, 43, 0.25)' : '1px solid var(--br)',
                              color: tag === 'AI' ? 'var(--orange)' : 'var(--cream3)'
                            }}
                          >
                            {tag}
                          </span>
                          {isCurrentUser && (
                            <span 
                              className="font-mono-custom" 
                              style={{ 
                                fontSize: '8px', 
                                border: '1px solid rgba(255,107,43,.4)', 
                                color: 'var(--orange)', 
                                padding: '1px 4px', 
                                borderRadius: '2px',
                                textTransform: 'uppercase'
                              }}
                            >
                              you
                            </span>
                          )}
                        </div>
                        <div className="font-mono-custom" style={{ fontSize: '10px', color: 'var(--cream3)' }}>
                          @{submission.owner}
                        </div>
                      </div>

                      {/* Score visual track */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ height: '2px', background: 'var(--br2)', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
                          <div 
                            className="score-fill"
                            style={{ 
                              height: '100%', 
                              width: animate ? `${(scoreNum / 100) * 100}%` : '0%',
                              background: 'linear-gradient(90deg, var(--dim), var(--cream3))'
                            }}
                          />
                        </div>
                        <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)' }}>
                          {pctOfTop}% of top score
                        </span>
                      </div>

                      {/* Score text pts */}
                      <div style={{ textAlign: 'right' }}>
                        <div className="font-mono-custom" style={{ fontSize: '16px', fontWeight: 700, color: isCurrentUser ? 'var(--orange)' : 'var(--cream)' }}>
                          {scoreNum.toFixed(1)}
                        </div>
                        <div className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', marginTop: '2px' }}>/ 100</div>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}

        {/* Section 8 - Bottom Strip */}
        <footer style={{ borderTop: '1px solid var(--br)', padding: '16px 0 32px 0', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '100px', height: '1px', background: 'var(--br2)', position: 'relative', overflow: 'hidden' }}>
              <div className="refresh-progress" style={{ position: 'absolute', top: 0, left: 0, height: '100%' }} />
            </div>
            <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)', textTransform: 'uppercase' }}>Refreshing</span>
          </div>
          <span className="font-mono-custom" style={{ fontSize: '9px', color: 'var(--dim)' }}>
            {secondsSinceUpdate === 0 ? 'Updated just now' : `Updated ${secondsSinceUpdate}s ago`}
          </span>
        </footer>

      </main>
    </div>
  );
}
