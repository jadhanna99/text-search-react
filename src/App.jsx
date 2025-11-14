import React, { useState, useMemo, useEffect, useRef } from "react";

// Sample articles array
const ARTICLES = [
  { id: 1, title: "How JavaScript Works", body: "JavaScript is a single-threaded language that uses an event loop to handle asynchronous operations. Understanding callbacks, promises, and async/await is key." },
  { id: 2, title: "React Search Tutorial", body: "This tutorial shows how to implement a text search component that highlights matched keywords in results. It covers debouncing, filtering, and highlighting techniques." },
  { id: 3, title: "CSS Tricks for Clean UI", body: "Simple CSS patterns make interfaces more readable. Use spacing, accessible colors, and readable font sizes to improve UX." },
  { id: 4, title: "Async Patterns in Node.js", body: "Explaining event-driven programming: callbacks vs streams vs promises and how they shape server-side code." },
  { id: 5, title: "Full Text Search Techniques", body: "Different search strategies: simple substring search, tokenization, stemming, and when to use an indexed engine like ElasticSearch." },
];

// Escape text for regex or HTML
function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function escapeHtml(unsafe) { return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }

// Highlight matched text
function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const tokens = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp).sort((a,b)=>b.length-b.length);
  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  return escapeHtml(text).replace(regex, "<mark>$1</mark>");
}

// Count matches
function countMatches(text, query) {
  if (!query) return 0;
  const tokens = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  const regex = new RegExp(`(${tokens.join("|")})`, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// Debounce hook
function useDebouncedValue(value, delay=300){
  const [debounced, setDebounced] = useState(value);
  useEffect(()=>{const id=setTimeout(()=>setDebounced(value),delay); return ()=>clearTimeout(id);}, [value, delay]);
  return debounced;
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const inputRef = useRef(null);

  const results = useMemo(()=>{
    if(!debouncedQuery) return ARTICLES.map(a=>({...a, matchCount:0}));
    const q = debouncedQuery.toLowerCase();
    return ARTICLES.map(a=>{
      const combined = `${a.title}\n${a.body}`;
      const matchCount = countMatches(combined, debouncedQuery);
      const isMatch = a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q);
      return {...a, isMatch, matchCount, combined};
    }).filter(a=>a.isMatch).sort((x,y)=>y.matchCount - x.matchCount);
  }, [debouncedQuery]);

  useEffect(()=>{
    const id="text-search-inline-styles";
    if(document.getElementById(id)) return;
    const style=document.createElement("style");
    style.id=id;
    style.innerHTML=`
      :root { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
      .app { max-width: 900px; margin: 28px auto; padding: 18px; }
      .search { display:flex; gap:8px; align-items:center; }
      .input { flex:1; padding:10px 12px; font-size:16px; border-radius:8px; border:1px solid #ddd; }
      .clear { padding:8px 12px; border-radius:8px; background:#f1f1f1; border:1px solid #ddd; cursor:pointer; }
      .meta { margin-top:8px; color:#555; }
      .results { margin-top:18px; display:flex; flex-direction:column; gap:12px; }
      .card { padding:14px; border-radius:10px; border:1px solid #eee; box-shadow:0 1px 2px rgba(0,0,0,0.02); }
      .title { font-weight:600; margin-bottom:6px; }
      mark { background: #ffea8a; padding:0 2px; border-radius:3px; }
      .no-results { color:#888; margin-top:12px; }
      .body { white-space: pre-wrap; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="app">
      <h1>Text Search with Highlight</h1>
      <div className="search">
        <input
          ref={inputRef}
          className="input"
          placeholder="Search titles or bodies..."
          value={query}
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e=>{if(e.key==="Escape") setQuery("");}}
        />
        <button className="clear" onClick={()=>{setQuery(""); inputRef.current?.focus();}}>Clear</button>
      </div>
      <div className="meta">
        Showing <strong>{debouncedQuery?results.length:ARTICLES.length}</strong> of <strong>{ARTICLES.length}</strong> articles
        {debouncedQuery?<span> — query: "{debouncedQuery}"</span>:null}
      </div>
      <div className="results">
        {results.length===0 && <div className="no-results">No articles match your search.</div>}
        {results.map(r=>(
          <article key={r.id} className="card">
            <div className="title" dangerouslySetInnerHTML={{__html:highlightText(r.title, debouncedQuery)}}/>
            <div className="body" dangerouslySetInnerHTML={{__html:highlightText(r.body, debouncedQuery)}}/>
            {r.matchCount?<div style={{marginTop:8,fontSize:13,color:"#555"}}>Matches: <strong>{r.matchCount}</strong></div>:null}
          </article>
        ))}
      </div>
    </div>
  );
}
