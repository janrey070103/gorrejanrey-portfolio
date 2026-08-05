import React, { useState, useRef, useEffect } from 'react';
import { SKILLS, PROJECTS, EXPERIENCE, QUICK_QUESTIONS, CERTIFICATIONS } from './data';
import { generateReply } from './gemini';
import './index.css';

import { SiGo, SiLaravel, SiPhp, SiFlask, SiPython, SiMongodb, SiExpress, SiReact, SiNodedotjs, SiFirebase, SiDotnet, SiGit, SiGithub, SiMysql, SiVercel, SiNetlify , SiClaude, SiCursor, SiGoogle , SiJsonwebtokens } from 'react-icons/si';
import { FaJava, FaCode, FaWindows, FaBrain } from 'react-icons/fa';
import { TbBrandCSharp, TbLetterZ, TbBrandOpenai } from 'react-icons/tb';

const getIconForSkill = (skill) => {
  const s = skill.toLowerCase();
  if (s.includes('golang')) return <SiGo className="skill-icon" />;
  if (s.includes('laravel')) return <SiLaravel className="skill-icon" />;
  if (s.includes('flask')) return <SiFlask className="skill-icon" />;
  if (s.includes('mern')) return <SiReact className="skill-icon" />;
  if (s.includes('mvc')) return <FaCode className="skill-icon" />;
  if (s.includes('react native')) return <SiReact className="skill-icon" />;
  if (s.includes('firebase')) return <SiFirebase className="skill-icon" />;
  if (s.includes('c#')) return <TbBrandCSharp className="skill-icon" />;
  if (s.includes('.net')) return <SiDotnet className="skill-icon" />;
  if (s.includes('java swing')) return <FaJava className="skill-icon" />;
  if (s.includes('winforms')) return <FaWindows className="skill-icon" />;
  if (s.includes('github')) return <SiGithub className="skill-icon" />;
  if (s.includes('git') && !s.includes('github')) return <SiGit className="skill-icon" />;
  if (s.includes('mysql')) return <SiMysql className="skill-icon" />;
  if (s.includes('vercel')) return <SiVercel className="skill-icon" />;
  if (s.includes('netlify')) return <SiNetlify className="skill-icon" />;
  if (s.includes('llm') || s.includes('prompting')) return <FaBrain className="skill-icon" />;
  if (s.includes('mongo')) return <SiMongodb className="skill-icon" />;
  if (s.includes('claude')) return <SiClaude className="skill-icon" />;
  if (s.includes('codex')) return <TbBrandOpenai className="skill-icon" />;
  if (s.includes('cursor')) return <SiCursor className="skill-icon" />;
  if (s.includes('google')) return <SiGoogle className="skill-icon" />;
  if (s.includes('jwt')) return <SiJsonwebtokens className="skill-icon" />;
  if (s.includes('z.ai') || s.includes('glm')) return <TbLetterZ className="skill-icon" style={{fontSize: '1.3em'}} />;
  return null;
};


function Chat({ isChatOpen, setIsChatOpen }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi — I'm the AI assistant for Jan Rey's portfolio. Ask me anything about his skills, projects, or experience listed above." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);
  const bodyRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIndicator(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  async function send(text) {
    const clean = text.trim();
    if (!clean) return;
    
    // Add user message to UI immediately
    setMessages((m) => [...m, { from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    
    // Call Gemini API (passing the history BEFORE the new user message)
    const reply = await generateReply(clean, messages);
    
    setTyping(false);
    setMessages((m) => [...m, { from: "bot", text: reply }]);
  }

  return (
    <div className="chat-widget">
      {!isChatOpen && (
        <div style={{ position: 'relative' }}>
          {showIndicator && (
            <div className="chat-indicator">
              Ask me anything!
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          )}
          <button className="chat-btn" onClick={() => { setIsChatOpen(true); setShowIndicator(false); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </button>
        </div>
      )}
      {isChatOpen && (
        <div className="chat-window">
          <div className="terminal">
            <div className="term-bar" style={{ cursor: 'pointer' }} onClick={() => setIsChatOpen(false)}>
              <div className="term-dots"><span></span><span></span><span></span></div>
              <div className="term-title">Jan Rey's assistant — ai.chat</div>
              <div style={{width:"38px", textAlign:'right', fontSize:'16px'}}>✕</div>
            </div>

            <div className="term-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={"msg " + (m.from === "user" ? "user" : "bot")}>
                  <span className="msg-label">{m.from === "user" ? "you" : "assistant"}</span>
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="msg bot">
                  <span className="msg-label">assistant</span>
                  <span className="typing"><span></span><span></span><span></span></span>
                </div>
              )}
            </div>

            <div className="chips">
              {QUICK_QUESTIONS.map((q) => (
                <button className="chip" key={q} onClick={() => send(q)}>{q}</button>
              ))}
            </div>

            <div className="term-input">
              <input
                placeholder="Type a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(input); }}
              />
              <button onClick={() => send(input)}>send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Page ---------------- */

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState("");

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus("Sending...");
    const formData = new FormData(e.target);
    
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setContactStatus("Error: Missing Web3Forms Access Key");
      return;
    }
    formData.append("access_key", accessKey);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      }).then(r => r.json());

      if (res.success) {
        setContactStatus("Message sent successfully!");
        e.target.reset();
      } else {
        setContactStatus("Error: " + res.message);
      }
    } catch (err) {
      setContactStatus("Error sending message.");
    }
  };


  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProject || selectedCert || isChatOpen || expandedSection) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject, selectedCert, isChatOpen, expandedSection]);

  return (
    <React.Fragment>
      <header>
        <div className="nav">
          <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="images/gorslogo.png" alt="Gors Logo" className="logo-img" />
          </div>
          <nav className="links" style={{ display: 'flex', alignItems: 'center' }}>
            <a href="#skills">skills</a>
            <a href="#projects">projects</a>
            <a href="#certifications">certifications</a>
            <a href="#experience">experience</a>
            <a href="#contact">contact</a>
            <button onClick={() => setIsDark(!isDark)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)', display: 'flex', alignItems: 'center', marginLeft: '12px' }} aria-label="Toggle Dark Mode">
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      <div className="hero">
        <div className="hero-content">
          <div className="eyebrow"><span className="dot"></span>available for freelance &amp; full-time work</div>
          <h1>Jan Rey Gorre<span className="cursor">&nbsp;</span></h1>
          <p className="lede">
            I'm an Information Technology graduate from STI West Negros University who enjoys building web, mobile, and desktop applications. I served as the lead programmer for our Capstone Project, and outside of coding, I am a former Mustang E-sports member for Honor of Kings.
          </p>
          <div className="hero-actions">
            <button className="btn btn-solid" onClick={() => setIsChatOpen(true)}>Ask the assistant</button>
            <a className="btn btn-outline" href="#projects">View projects</a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img 
            src="images/portimage_cropped.png" 
            alt="Portfolio" 
            className="hero-image"
          />
        </div>
      </div>

      <div className="bento-grid wrap">
        <div className="bento-card" id="skills">
          <div className="section-head">
            <h2>Skills</h2>
            <span className="section-num">01 / directory listing</span>
          </div>
          <div className="dir">
            {SKILLS.map((s) => (
              <div className="dir-row" key={s.key}>
                <div className="dir-key">{s.key}</div>
                <div className="tag-row">
                  {s.tags.map((t) => (
                    <span className="tag" key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {t} {getIconForSkill(t)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card" id="projects">
          <div className="section-head">
            <h2>Projects</h2>
            <span className="section-num">02 / commit log</span>
          </div>
          {PROJECTS.slice(0, 3).map((p) => (
            <div className="log-entry" key={p.id} onClick={() => setSelectedProject(p)}>
              <div className="log-hash">#{p.id}</div>
              <div>
                <p className="log-title">{p.title}</p>
                <p className="log-desc">{p.desc}</p>
                <span className="tag">{p.stack}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" style={{marginTop: 'auto', alignSelf: 'flex-start'}} onClick={() => setExpandedSection('projects')}>See more Projects...</button>
        </div>

        <div className="bento-card" id="certifications">
          <div className="section-head">
            <h2>Certifications</h2>
            <span className="section-num">03 / credentials</span>
          </div>
          {CERTIFICATIONS.slice(0, 3).map((c) => (
            <div className="log-entry" key={c.id} onClick={() => setSelectedCert(c)}>
              <div className="cert-logo-badge">
                <img
                  src={c.logo}
                  alt={c.issuer}
                  className="cert-logo-img"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="cert-logo-text">${c.issuer.split(' ')[0]}</span>`;
                  }}
                />
              </div>
              <div>
                <p className="log-title">{c.title}</p>
                <span className="tag">{c.issuer}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" style={{marginTop: 'auto', alignSelf: 'flex-start'}} onClick={() => setExpandedSection('certifications')}>See more Certifications...</button>
        </div>

        <div className="bento-card" id="experience">
          <div className="section-head">
            <h2>Experience</h2>
            <span className="section-num">04 / timeline</span>
          </div>
          <div className="tl">
            {EXPERIENCE.map((e) => (
              <div className="tl-item" key={e.role}>
                <div className="tl-year">{e.year}</div>
                <p className="tl-role">{e.role}</p>
                <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="contact">
        <div className="wrap">
          <div className="section-head">
            <h2>Contact</h2>
            <span className="section-num">05 / get in touch</span>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="k">GMAIL</div>
              <div className="v">gorrejanrey@gmail.com</div>
            </div>
            <div className="contact-card">
              <div className="k">HIRE ME</div>
              <div className="v">
                <a href="RESUME-JAN_REY_GORRE.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  View Resume (PDF)
                </a>
              </div>
            </div>
            <div className="contact-card">
              <div className="k">CONTACT NUMBER</div>
              <div className="v">+63 998 206 6108</div>
            </div>
            <div className="contact-card">
              <div className="k">ADDRESS</div>
              <div className="v">San Lorenzo Homes, Brgy. Tangub, Bacolod City, Negros Occidental, Philippines</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <a href="https://github.com/janrey070103" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', display: 'inline-flex', padding: '12px', border: '1px solid var(--border)', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/jan-rey-gorre-57b7233ba/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', display: 'inline-flex', padding: '12px', border: '1px solid var(--border)', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <button onClick={() => { setIsContactModalOpen(true); setContactStatus(""); }} style={{ color: 'var(--text)', display: 'inline-flex', padding: '12px', border: '1px solid var(--border)', borderRadius: '50%', background: 'transparent', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </button>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-row" style={{ justifyContent: 'center' }}>
          <span>© {new Date().getFullYear()} — Jan Rey Gorre</span>
        </div>
      </footer>

      


      {isContactModalOpen && (
        <div className="modal-overlay" onClick={() => setIsContactModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Send a Message</h3>
              <button className="close-btn" onClick={() => setIsContactModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" className="form-input" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" className="form-input" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" className="form-input form-textarea" rows="4" required></textarea>
                </div>
                
                {/* Honeypot Spam Protection */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <button type="submit" className="btn btn-solid" style={{ width: '100%', marginTop: '8px' }}>
                  Send Message
                </button>
                {contactStatus && (
                  <p style={{ marginTop: '12px', fontSize: '0.9rem', color: contactStatus.includes('Error') ? 'red' : 'green' }}>
                    {contactStatus}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {expandedSection === 'projects' && (
        <div className="modal-overlay" onClick={() => setExpandedSection(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setExpandedSection(null)}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">All Projects</h2>
            </div>
            {PROJECTS.map((p) => (
              <div className="log-entry" key={p.id} onClick={() => { setSelectedProject(p); }}>
                <div className="log-hash">#{p.id}</div>
                <div>
                  <p className="log-title">{p.title}</p>
                  <p className="log-desc">{p.desc}</p>
                  <span className="tag">{p.stack}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expandedSection === 'certifications' && (
        <div className="modal-overlay" onClick={() => setExpandedSection(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setExpandedSection(null)}>×</button>
            <div className="modal-header">
              <h2 className="modal-title">All Certifications</h2>
            </div>
            {CERTIFICATIONS.map((c) => (
              <div className="log-entry" key={c.id} onClick={() => { setSelectedCert(c); }}>
                <div className="cert-logo-badge">
                  <img
                    src={c.logo}
                    alt={c.issuer}
                    className="cert-logo-img"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="cert-logo-text">${c.issuer.split(' ')[0]}</span>`;
                    }}
                  />
                </div>
                <div>
                  <p className="log-title">{c.title}</p>
                  <span className="tag">{c.issuer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {showScrollTop && (
        <button 
          className="scroll-top-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
      )}

      <Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>
            <div className="modal-header">
              <h3 className="modal-title">{selectedProject.title}</h3>
              <p className="modal-desc">{selectedProject.desc}</p>
              {selectedProject.repo && (
                <a href={selectedProject.repo} target="_blank" rel="noopener noreferrer" className="modal-link">
                  {selectedProject.repo.includes('github.com') ? 'View Source Code' : 'View Live Demo'}
                </a>
              )}
            </div>
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="modal-gallery">
                {selectedProject.images.map((imgSrc, idx) => (
                  <img key={idx} src={imgSrc} alt={`${selectedProject.title} screenshot ${idx + 1}`} loading="lazy" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCert(null)}>×</button>
            <div className="modal-header">
              <h3 className="modal-title">{selectedCert.title}</h3>
              <p className="modal-desc">Issued by {selectedCert.issuer}</p>
            </div>
            <div className="modal-gallery">
              <img src={selectedCert.image} alt={selectedCert.title} loading="lazy" />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default App;
