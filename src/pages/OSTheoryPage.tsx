import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { THEORY_TOPICS, THEORY_UNITS } from '../data/theoryData';
import { UnitId, TheoryTopic } from '../types/theory';
import { TheoryTopicView } from '../components/theory/TheoryTopicView';

interface OSTheoryPageProps {
  initialTopicId?: string;
  initialUnitId?: UnitId;
}

export const OSTheoryPage: React.FC<OSTheoryPageProps> = ({
  initialTopicId,
  initialUnitId = 'unit-1',
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId>(initialUnitId);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || THEORY_TOPICS.find((t) => t.unitId === initialUnitId)?.id || THEORY_TOPICS[0].id
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  React.useEffect(() => {
    if (initialTopicId) {
      const topic = THEORY_TOPICS.find((t) => t.id === initialTopicId);
      if (topic) {
        setSelectedUnitId(topic.unitId);
        setSelectedTopicId(topic.id);
      }
    }
  }, [initialTopicId]);

  const currentUnit = useMemo(
    () => THEORY_UNITS.find((u) => u.id === selectedUnitId) || THEORY_UNITS[0],
    [selectedUnitId]
  );

  const unitTopics = useMemo(
    () => THEORY_TOPICS.filter((t) => t.unitId === selectedUnitId),
    [selectedUnitId]
  );

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return THEORY_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortSummary.toLowerCase().includes(q) ||
        t.industrialApplication.company.toLowerCase().includes(q) ||
        t.industrialApplication.systemName.toLowerCase().includes(q) ||
        t.keyTakeaways.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const activeTopic = useMemo(() => {
    return (
      THEORY_TOPICS.find((t) => t.id === selectedTopicId) ||
      unitTopics[0] ||
      THEORY_TOPICS[0]
    );
  }, [selectedTopicId, unitTopics]);

  const currentIndex = unitTopics.findIndex((t) => t.id === activeTopic.id);
  const prevTopic = currentIndex > 0 ? unitTopics[currentIndex - 1] : undefined;
  const nextTopic =
    currentIndex < unitTopics.length - 1 ? unitTopics[currentIndex + 1] : undefined;

  const handleSelectTopic = (topic: TheoryTopic) => {
    setSelectedUnitId(topic.unitId);
    setSelectedTopicId(topic.id);
    setSearchQuery('');
  };

  const handleSelectUnit = (unitId: UnitId) => {
    setSelectedUnitId(unitId);
    const firstTopic = THEORY_TOPICS.find((t) => t.unitId === unitId);
    if (firstTopic) {
      setSelectedTopicId(firstTopic.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* Page Header - Clean, Flat & Non-Boxed */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dfd7c6]/60">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#2d5a88]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#2c2825] tracking-tight font-mono">
              OS Theory & Industrial Applications
            </h1>
          </div>
          <p className="text-xs text-[#78716c] mt-1">
            Complete syllabus theory, interactive animations, and production case studies across Units I to V.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topics & case studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#dfd7c6] rounded-lg text-xs font-mono placeholder:text-[#a8a29e] focus:outline-none focus:ring-1 focus:ring-[#2d5a88]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#78716c] hover:text-[#2c2825]"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown if Searching */}
      {filteredTopics && (
        <div className="p-4 bg-white border border-[#dfd7c6] rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#dfd7c6]/60">
            <span className="text-xs font-mono font-bold text-[#57534e]">
              Search Results ({filteredTopics.length} matches):
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#2d5a88] font-mono hover:underline"
            >
              Close Results
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
            {filteredTopics.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelectTopic(t)}
                className="p-3 rounded-lg hover:bg-[#f5f0e1] cursor-pointer transition-colors border-b border-[#dfd7c6]/40 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2c2825]">{t.title}</span>
                  <span className="text-[10px] font-mono text-[#78716c]">
                    Unit {t.unitNumber}
                  </span>
                </div>
                <p className="text-[11px] text-[#78716c] mt-0.5 truncate">{t.shortSummary}</p>
                <span className="text-[10px] text-[#2d5a88] font-mono block mt-1 font-semibold">
                  🏢 {t.industrialApplication.company}: {t.industrialApplication.systemName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unit Selector Tabs - Clean Flat Segment Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#dfd7c6]/60">
        {THEORY_UNITS.map((unit) => {
          const isSelected = selectedUnitId === unit.id;
          return (
            <button
              key={unit.id}
              onClick={() => handleSelectUnit(unit.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#2d5a88] text-white font-bold shadow-xs'
                  : 'text-[#57534e] hover:bg-[#eee8db] hover:text-[#2c2825]'
              }`}
            >
              <span>Unit {unit.number}:</span>
              <span className="opacity-90">{unit.title.split(':')[1]?.trim() || unit.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Layout: Left Sidebar + Right Active View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Documentation-style Topic Navigation */}
        <div className="lg:col-span-1 space-y-1 sticky top-20">
          <div className="pb-2 mb-1 border-b border-[#dfd7c6]/60">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#78716c]">
              {currentUnit.title.split(':')[0]} Topics
            </span>
          </div>

          <div className="space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {unitTopics.map((topic, idx) => {
              const isActive = activeTopic.id === topic.id;
              const isRevision = topic.id.includes('revision');
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-[#2d5a88]/10 text-[#2d5a88] font-bold'
                      : 'text-[#57534e] hover:bg-[#eee8db]/60 hover:text-[#2c2825]'
                  }`}
                >
                  <span className="truncate">{topic.title}</span>
                  <span className="text-[10px] font-mono opacity-50 shrink-0">
                    {isRevision ? '★' : `${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Topic Viewer */}
        <div className="lg:col-span-3">
          <TheoryTopicView
            topic={activeTopic}
            onNavigateTopic={(topicId) => setSelectedTopicId(topicId)}
            prevTopic={prevTopic}
            nextTopic={nextTopic}
          />
        </div>
      </div>
    </div>
  );
};
