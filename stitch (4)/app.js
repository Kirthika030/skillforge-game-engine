/**
 * SkillForge Shared App State
 * Single source of truth via localStorage.
 * All pages read from and write through this module.
 */

const SkillForge = (() => {
    const KEYS = {
        score:    'sf_totalScore',
        completed:'sf_completedMissions',
        attempts: 'sf_totalAttempts',
        correct:  'sf_correctAnswers',
    };

    function getScore()      { return parseInt(localStorage.getItem(KEYS.score))    || 0; }
    function getCompleted()  { return new Set(JSON.parse(localStorage.getItem(KEYS.completed) || '[]')); }
    function getAttempts()   { return parseInt(localStorage.getItem(KEYS.attempts)) || 0; }
    function getCorrect()    { return parseInt(localStorage.getItem(KEYS.correct))  || 0; }

    function saveScore(v)    { localStorage.setItem(KEYS.score,    v); }
    function saveCompleted(s){ localStorage.setItem(KEYS.completed, JSON.stringify([...s])); }
    function saveAttempts(v) { localStorage.setItem(KEYS.attempts, v); }
    function saveCorrect(v)  { localStorage.setItem(KEYS.correct,  v); }

    function recordCorrect(missionIndex, earnedScore) {
        const completed = getCompleted();
        let isNew = false;
        if (!completed.has(missionIndex)) {
            completed.add(missionIndex);
            saveCompleted(completed);
            const newScore = getScore() + earnedScore;
            saveScore(newScore);
            const correct  = getCorrect() + 1;
            saveCorrect(correct);
            isNew = true;
        }
        const attempts = getAttempts() + 1;
        saveAttempts(attempts);
        return isNew;
    }

    function recordAttempt() {
        saveAttempts(getAttempts() + 1);
    }

    function getStats() {
        const completed = getCompleted();
        const correct   = getCorrect();
        const attempts  = getAttempts();
        const score     = getScore();
        const accuracy  = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
        let level = 'Beginner';
        if (correct >= 30) level = 'Forge Master';
        else if (correct >= 15) level = 'Advanced';
        else if (correct >= 5)  level = 'Intermediate';
        return { completed: completed.size, score, accuracy, level, completedSet: completed, correct, attempts };
    }

    function getJobReadinessPct(totalMissions) {
        const done = getCompleted().size;
        if (!totalMissions) return 0;
        return Math.min(Math.round((done / totalMissions) * 100), 100);
    }

    function reset() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }

    return { getScore, getCompleted, getAttempts, getCorrect,
             recordCorrect, recordAttempt, getStats, getJobReadinessPct, reset };
})();
