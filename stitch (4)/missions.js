document.addEventListener("DOMContentLoaded", () => {
    let missions = [];
    let currentMissionIndex = 0;
    let timerInterval = null;
    let timeLeft = 0;

    // ── DOM refs ──────────────────────────────────────────────────
    const el = {
        title:           document.getElementById('mission-title'),
        diffBadge:       document.getElementById('mission-difficulty-badge'),
        difficulty:      document.getElementById('mission-difficulty'),
        counter:         document.getElementById('mission-counter'),
        timer:           document.getElementById('mission-timer'),
        multiplier:      document.getElementById('mission-multiplier'),
        dataStructure:   document.getElementById('mission-data-structure'),
        description:     document.getElementById('mission-description'),
        inputEx:         document.getElementById('mission-input-example'),
        outputEx:        document.getElementById('mission-output-example'),
        constraints:     document.getElementById('mission-constraints'),
        fileName:        document.getElementById('mission-file-name'),
        fileLang:        document.getElementById('mission-file-language'),
        editor:          document.getElementById('mission-editor'),
        submitBtn:       document.getElementById('submit-btn'),
        nextBtn:         document.getElementById('next-btn'),
        feedbackArea:    document.getElementById('feedback-area'),
        feedbackIcon:    document.getElementById('feedback-icon'),
        feedbackText:    document.getElementById('feedback-text'),
        feedbackSub:     document.getElementById('feedback-subtitle'),
        feedbackScore:   document.getElementById('feedback-score-text'),
        scoreDisplay:    document.getElementById('total-score-display'),
        progressText:    document.getElementById('milestone-progress-text'),
        progressBar:     document.getElementById('milestone-progress-bar'),
        xpBar:           document.getElementById('xp-progress-bar'),
        sidebarList:     document.getElementById('mission-sidebar-list'),
        mpPanel:         document.getElementById('multiplayer-room-panel'),
        mpRoomCode:      document.getElementById('room-code-display-nav'),
        mpScore1:        document.getElementById('sim-score-1'),
        mpScore2:        document.getElementById('sim-score-2'),
        mpScoreMine:     document.getElementById('sim-score-my'),
    };

    // ── Room handling ─────────────────────────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode  = urlParams.get('room');
    if (roomCode && el.mpPanel) {
        el.mpPanel.classList.remove('hidden');
        if (el.mpRoomCode) el.mpRoomCode.textContent = roomCode;
        let s1 = 0, s2 = 0;
        setInterval(() => {
            if (Math.random() > 0.55) { s1 += Math.floor(Math.random() * 25) + 5; if (el.mpScore1) el.mpScore1.textContent = s1; }
            if (Math.random() > 0.65) { s2 += Math.floor(Math.random() * 25) + 5; if (el.mpScore2) el.mpScore2.textContent = s2; }
        }, 3500);
    }

    // ── Refresh UI from shared state ──────────────────────────────
    function refreshScoreUI() {
        const score = SkillForge.getScore();
        const done  = SkillForge.getCompleted().size;
        const total = missions.length || 52;

        if (el.scoreDisplay) el.scoreDisplay.textContent = score.toLocaleString();
        if (el.mpScoreMine)  el.mpScoreMine.textContent  = score;

        const pct = total ? Math.round((done / total) * 100) : 0;
        if (el.progressText) el.progressText.textContent = pct + '%';
        if (el.progressBar)  el.progressBar.style.width  = pct + '%';

        const xpPct = Math.min(Math.round((score / 5000) * 100), 100);
        if (el.xpBar) el.xpBar.style.width = xpPct + '%';
    }

    // ── Sidebar ───────────────────────────────────────────────────
    function renderSidebar() {
        if (!el.sidebarList) return;
        el.sidebarList.innerHTML = '';
        const completed = SkillForge.getCompleted();

        const groups = {};
        missions.forEach((m, i) => {
            const key = m.dataStructure || 'Other';
            if (!groups[key]) groups[key] = [];
            groups[key].push({ ...m, idx: i });
        });

        for (const [topic, list] of Object.entries(groups)) {
            const hdr = document.createElement('div');
            hdr.className = 'mt-4 mb-1 px-3 text-[9px] uppercase tracking-[0.2em] text-[#adaaaa] font-bold';
            hdr.textContent = topic;
            el.sidebarList.appendChild(hdr);

            list.forEach(m => {
                const item = document.createElement('div');
                const isDone = completed.has(m.idx);
                const diffColor  = m.difficulty === 'Easy' ? '#a1ffc2' : m.difficulty === 'Medium' ? '#feb700' : '#ff6e85';
                item.className = 'group flex items-center gap-2 hover:bg-[#1a1a1a] p-2.5 px-3 cursor-pointer transition-all rounded-lg mx-1 mb-0.5';
                item.dataset.idx = m.idx;
                item.innerHTML = `
                    <span class="material-symbols-outlined text-[14px] ${isDone ? 'text-[#a1ffc2]' : 'text-[#484847]'}" style="font-variation-settings:'FILL' ${isDone ? 1 : 0}">
                        ${isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span class="flex-1 text-sm text-on-surface group-hover:text-[#00FF9C] transition-colors truncate leading-tight">${m.title}</span>
                    <span class="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase" style="color:${diffColor};border:1px solid ${diffColor}40;background:${diffColor}10">${m.difficulty}</span>
                `;
                item.addEventListener('click', () => {
                    currentMissionIndex = m.idx;
                    loadMission(currentMissionIndex);
                });
                el.sidebarList.appendChild(item);
            });
        }
    }

    function setSidebarActive(index) {
        document.querySelectorAll('#mission-sidebar-list [data-idx]').forEach(el => {
            const match = parseInt(el.dataset.idx) === index;
            el.classList.toggle('bg-[#1a1a1a]', match);
            el.classList.toggle('border-l-2', match);
            el.classList.toggle('border-[#00FF9C]', match);
            if (match) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ── Load mission ──────────────────────────────────────────────
    function loadMission(index) {
        if (index >= missions.length) {
            el.title.textContent       = 'All Missions Complete!';
            el.description.textContent = 'Congratulations! You have solved all available missions.';
            clearTimer();
            el.editor.value    = '';
            el.editor.disabled = true;
            el.submitBtn.style.display = 'none';
            el.nextBtn.style.display   = 'none';
            return;
        }

        const m = missions[index];

        el.title.textContent = m.title;
        el.counter.textContent = `Mission ${index + 1} of ${missions.length}`;
        el.multiplier.textContent = `x${m.multiplier.toFixed(1)}`;
        el.dataStructure.innerHTML = (m.dataStructure || '').split(' ').join('<br/>');
        el.description.textContent = m.description;
        el.inputEx.textContent     = m.inputExample;
        el.outputEx.textContent    = m.outputExample;

        // Difficulty
        const colors = { Easy: { badge: 'border-[#a1ffc2] text-[#a1ffc2]', text: 'text-[#a1ffc2]' },
                         Medium: { badge: 'border-[#feb700] text-[#feb700]', text: 'text-[#feb700]' },
                         Hard:   { badge: 'border-[#ff6e85] text-[#ff6e85]', text: 'text-[#ff6e85]' } };
        const c = colors[m.difficulty] || colors.Medium;
        el.diffBadge.textContent  = m.difficulty;
        el.diffBadge.className    = `px-2 py-0.5 bg-surface-container-highest border-l-2 text-[10px] font-bold tracking-widest uppercase ${c.badge}`;
        el.difficulty.textContent = m.difficulty;
        el.difficulty.className   = `font-headline text-2xl ${c.text}`;

        // Constraints
        el.constraints.innerHTML = '';
        (m.constraints || []).forEach(c => {
            const li = document.createElement('li');
            li.className = 'flex items-center gap-3 text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg';
            li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-outline flex-shrink-0"></span><span>${c}</span>`;
            el.constraints.appendChild(li);
        });

        el.fileName.textContent    = m.fileName    || 'solution.py';
        el.fileLang.textContent    = m.fileLanguage || 'Python 3.10';
        el.editor.value            = m.startingCode || '# Write your solution here\n';
        el.editor.disabled         = false;

        // Reset feedback UI
        el.feedbackArea.classList.add('hidden');
        el.nextBtn.classList.add('hidden');
        el.submitBtn.classList.remove('hidden');
        el.submitBtn.disabled = false;

        setSidebarActive(index);
        refreshScoreUI();
        startTimer(m.timeLimit || 600);
    }

    // ── Timer ─────────────────────────────────────────────────────
    function startTimer(secs) {
        clearTimer();
        timeLeft = secs;
        renderTimer();
        timerInterval = setInterval(() => {
            timeLeft--;
            renderTimer();
            if (timeLeft <= 0) { clearTimer(); handleTimeout(); }
        }, 1000);
    }

    function clearTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function renderTimer() {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        el.timer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        el.timer.className   = timeLeft < 60
            ? 'font-headline text-2xl text-[#ff6e85]'
            : 'font-headline text-2xl text-[#00fc9a]';
    }

    function handleTimeout() {
        el.editor.disabled = true;
        el.submitBtn.classList.add('hidden');
        showFeedback(false, "Time's Up!", "Mission failed — timer ran out.", 0);
    }

    // ── Submit ────────────────────────────────────────────────────
    el.submitBtn.addEventListener('click', () => {
        const m   = missions[currentMissionIndex];
        const val = el.editor.value.trim();
        if (!val) return;

        const regex = new RegExp(m.validationRegex || 'return', 'i');
        SkillForge.recordAttempt();

        if (regex.test(val)) {
            clearTimer();
            el.editor.disabled = true;
            el.submitBtn.classList.add('hidden');
            el.nextBtn.classList.remove('hidden');

            const earned = Math.floor(m.score * m.multiplier);
            const isNew  = SkillForge.recordCorrect(currentMissionIndex, earned);
            refreshScoreUI();
            renderSidebar(); // re-render to show green tick

            showFeedback(true,
                'Correct Answer!',
                `+${earned} XP · Runtime: ${Math.floor(Math.random()*50)+10}ms · Memory: 15.2MB`,
                earned
            );
        } else {
            showFeedback(false, 'Wrong Answer', "That doesn't look right. Check your logic and try again.", 0);
            setTimeout(() => el.feedbackArea.classList.add('hidden'), 3000);
        }
    });

    el.nextBtn.addEventListener('click', () => {
        currentMissionIndex = Math.min(currentMissionIndex + 1, missions.length - 1);
        loadMission(currentMissionIndex);
    });

    // ── Feedback ──────────────────────────────────────────────────
    function showFeedback(success, title, sub, score) {
        el.feedbackArea.classList.remove('hidden');
        el.feedbackText.textContent  = title;
        el.feedbackSub.textContent   = sub;
        el.feedbackScore.textContent = score > 0 ? `+${score} XP` : '';

        if (success) {
            el.feedbackArea.className  = 'p-4 rounded-xl border border-[#00fc9a]/20 bg-[#00fc9a]/5 flex items-start gap-4';
            el.feedbackIcon.textContent = 'check_circle';
            el.feedbackIcon.className   = 'material-symbols-outlined text-[#00fc9a] text-2xl flex-shrink-0';
            el.feedbackText.className   = 'font-headline font-bold text-[#00fc9a]';
            el.feedbackScore.className  = 'text-sm font-bold text-[#feb700] mt-1';
        } else {
            el.feedbackArea.className  = 'p-4 rounded-xl border border-[#ff6e85]/20 bg-[#ff6e85]/5 flex items-start gap-4';
            el.feedbackIcon.textContent = 'cancel';
            el.feedbackIcon.className   = 'material-symbols-outlined text-[#ff6e85] text-2xl flex-shrink-0';
            el.feedbackText.className   = 'font-headline font-bold text-[#ff6e85]';
            el.feedbackScore.className  = 'text-sm font-bold text-[#ff6e85] mt-1';
        }
    }

    // Check if a specific mission was requested from job readiness page
    const startIdx = parseInt(urlParams.get('idx')) || 0;

    // ── Boot ──────────────────────────────────────────────────────
    fetch('missions.json')
        .then(r => r.json())
        .then(data => {
            missions = data;
            renderSidebar();
            refreshScoreUI();
            loadMission(Math.min(startIdx, data.length - 1));
        })
        .catch(e => console.error('Failed to load missions.json:', e));
});
