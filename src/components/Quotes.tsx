import { useState } from 'react';

interface QuotesProps {
  customQuotes: string[];
  onUpdate: (quotes: string[]) => void;
}

export default function Quotes({ customQuotes, onUpdate }: QuotesProps) {
  const [newQuote, setNewQuote] = useState('');

  const addQuote = () => {
    if (!newQuote.trim()) return;
    onUpdate([newQuote.trim(), ...customQuotes]);
    setNewQuote('');
  };

  const deleteQuote = (idx: number) => {
    onUpdate(customQuotes.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h3>鼓励语录</h3>
      <p className="hint">内置 20 条鼓励语，点击桌宠即可随机展示。你可以在这里添加专属语录。</p>
      <div className="todo-form">
        <input
          type="text"
          placeholder="写一句鼓励自己的话..."
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addQuote()}
        />
        <button className="primary" onClick={addQuote}>添加</button>
      </div>
      <div className="quote-list">
        {customQuotes.map((q, idx) => (
          <div key={idx} className="quote-item">
            <span>{q}</span>
            <button className="danger" onClick={() => deleteQuote(idx)}>删除</button>
          </div>
        ))}
        {customQuotes.length === 0 && <p className="hint">还没有自定义语录~</p>}
      </div>
    </div>
  );
}
