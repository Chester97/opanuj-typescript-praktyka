const LEVEL_DEFINITIONS = {
  '000': { name: 'Wstęp', level: 0 },
  121: { name: 'Tajniki kompilatora', level: 1 },
  122: { name: 'Tajniki kompilatora', level: 1 },
  211: { name: 'System typów', level: 2 },
  212: { name: 'System typów', level: 2 },
  221: { name: 'System typów', level: 2 },
  231: { name: 'System typów', level: 2 },
  311: { name: 'Typy generyczne', level: 3 },
  321: { name: 'Typy generyczne', level: 3 },
  322: { name: 'Typy generyczne', level: 3 },
  331: { name: 'Typy generyczne', level: 3 },
  341: { name: 'Typy generyczne', level: 3 },
  411: { name: 'Algebra typów', level: 4 },
  412: { name: 'Algebra typów', level: 4 },
  421: { name: 'Algebra typów', level: 4 },
  422: { name: 'Algebra typów', level: 4 },
  431: { name: 'Algebra typów', level: 4 },
  441: { name: 'Algebra typów', level: 4 },
  442: { name: 'Algebra typów', level: 4 },
  611: { name: 'Moduły i projekty', level: 6 },
  621: { name: 'Moduły i projekty', level: 6 },
  622: { name: 'Moduły i projekty', level: 6 },
  631: { name: 'Moduły i projekty', level: 6 },
  632: { name: 'Moduły i projekty', level: 6 },
  731: { name: 'JavaScript - Integracje', level: 7 },
};

async function fetchResults() {
  try {
    const response = await fetch('../data/results.json');
    return await response.json();
  } catch (error) {
    console.error('Error fetching results:', error);
    return null;
  }
}

function renderOverallProgress(results) {
  const challenges = getAllChallenges(results);
  const completedChallenges = challenges.filter(
    (challenge) => challenge.status === 'complete',
  ).length;
  const totalChallenges = challenges.length;
  const progressPercentage = Math.round((completedChallenges / totalChallenges) * 100);

  const progressHtml = `
    <div class="bg-slate-800/50 border border-blue-500 p-8 rounded-2xl">
      <div class="flex justify-between items-center mb-6">
        <div>
          <span class="text-white text-lg font-medium tracking-wide block mb-1">Progress Tracker</span>
          <span class="text-gray-400 text-sm font-light">Dobra robota, oby tak dalej!</span>
        </div>
        <div class="text-right">
          <span class="text-blue-400 font-semibold text-3xl block">${progressPercentage}%</span>
          <span class="text-gray-400 text-sm font-light">${completedChallenges}/${totalChallenges} zadań zaliczonych</span>
        </div>
      </div>
      <div class="bg-black/30 rounded-full h-3 w-full overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full h-3 transition-all duration-700 progress-glow"
             style="width: ${progressPercentage}%"></div>
      </div>
    </div>
  `;

  document.getElementById('overall-progress').innerHTML = progressHtml;
}

function getChallengeLevel(testName) {
  const match = testName.match(/\/(\d{3})-/);
  return match ? match[1] : null;
}

function getTestDetails(suite) {
  if (!suite.assertionResults || suite.assertionResults.length === 0) {
    return [
      {
        name: suite.message || 'Test not implemented',
        status: 'failed',
        fullName: suite.name,
      },
    ];
  }

  return suite.assertionResults.map((test) => ({
    name: test.title,
    status: test.status,
    fullName: test.fullName,
  }));
}

function getAllChallenges(results) {
  const challenges = [];

  results.testResults.forEach((suite) => {
    const levelCode = getChallengeLevel(suite.name);
    if (levelCode && LEVEL_DEFINITIONS[levelCode]) {
      const levelInfo = LEVEL_DEFINITIONS[levelCode];
      const testDetails = getTestDetails(suite);
      const passedTests = testDetails.filter((test) => test.status === 'passed').length;
      const totalTests = testDetails.length;

      challenges.push({
        name: suite.name.split('/').pop().replace('.spec.ts', ''),
        level: levelInfo.level,
        levelName: levelInfo.name,
        levelCode,
        passedTests,
        totalTests,
        status:
          passedTests === totalTests ? 'complete' : passedTests > 0 ? 'partial' : 'incomplete',
        testDetails,
      });
    }
  });

  return challenges.sort((a, b) => {
    // First sort by level number
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    // Then by level code for challenges within same level
    return Number(a.levelCode) - Number(b.levelCode);
  });
}

function getStatusColor(status) {
  switch (status) {
    case 'complete':
      return 'border-lime-500/10 text-lime-400 bg-lime-950/50 hover:bg-lime-950/80';
    case 'partial':
      return 'border-orange-500/10 text-orange-400 bg-orange-950/50 hover:bg-orange-950/80';
    case 'incomplete':
      return 'border-slate-500/10 text-slate-400 bg-slate-950/50 hover:bg-slate-950/80';
    default:
      return 'border-slate-500/10 text-slate-400 bg-slate-950/50 hover:bg-slate-950/80';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'complete':
      return `<svg class="w-4 h-4 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>`;
    case 'partial':
      return `<svg class="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"/>
      </svg>`;
    default:
      return `<svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd"/>
      </svg>`;
  }
}

function toggleTestDetails(cardId) {
  const detailsElement = document.getElementById(`details-${cardId}`);
  const isExpanded = detailsElement.classList.contains('hidden');

  if (isExpanded) {
    detailsElement.classList.remove('hidden');
  } else {
    detailsElement.classList.add('hidden');
  }
}

function renderChallenges(results) {
  const container = document.getElementById('levels');
  const challenges = getAllChallenges(results);

  const gridHtml = `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      ${challenges
        .map(
          (challenge, idx) => `
          <div class="challenge-card rounded-xl ${getStatusColor(
            challenge.status,
          )} card-hover aspect-square flex flex-col">
            <div class="p-4 flex-1 cursor-pointer flex flex-col" onclick="toggleTestDetails('${idx}')">
              <div class="flex flex-col gap-2 mb-4">
                <div class="text-blue-400/80 text-xs font-medium tracking-wider">${challenge.levelName}</div>
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-medium text-white/90 uppercase tracking-wide text-sm">${
                    challenge.name
                  }</h3>
                  <span class="text-lg shrink-0" title="${challenge.status}">${getStatusIcon(
                    challenge.status,
                  )}</span>
                </div>
              </div>
              <div class="mt-auto">
                <div class="bg-black/30 rounded-full h-1.5 w-full mb-2 overflow-hidden">
                  <div class="bg-current rounded-full h-1.5 transition-all duration-500"
                       style="width: ${(challenge.passedTests / challenge.totalTests) * 100}%"></div>
                </div>
                <div class="text-sm font-medium text-center">
                  Progress: ${challenge.passedTests}/${challenge.totalTests}
                </div>
              </div>
            </div>
            <div id="details-${idx}" class="hidden border-t border-white/5">
              <div class="p-4 space-y-2 max-h-48 overflow-y-auto">
                ${challenge.testDetails
                  .map(
                    (test) => `
                    <div class="flex items-center justify-between gap-2 text-sm">
                      <span class="text-white/70 truncate">${test.name}</span>
                      <span class="${
                        test.status === 'passed' ? 'text-lime-400' : 'text-slate-400'
                      } shrink-0">${getStatusIcon(
                        test.status === 'passed' ? 'complete' : 'incomplete',
                      )}</span>
                    </div>
                  `,
                  )
                  .join('')}
              </div>
            </div>
          </div>
        `,
        )
        .join('')}
    </div>
  `;

  container.innerHTML = gridHtml;
}

async function initDashboard() {
  const results = await fetchResults();
  if (!results) return;

  renderOverallProgress(results);
  renderChallenges(results);
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard);