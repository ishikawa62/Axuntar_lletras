
function showStatistics() {
    const { wordlePlayed, wordleWinCount, currentStreak, maxStreak } = getSavedData() || {}

    const container = document.createElement('div')
    container.setAttribute('id', 'statistics-container')

    const statistics = `<h2>Reconto</h2>
    <div class="player-statistics">
        <div class="state-data">
            <span class="data" data-wordle-played>${wordlePlayed || 0}</span>
            <span class="data-title">Xogados</span>
        </div>
        <div class="state-data">
            <span class="data" data-wordle-played>${wordleWinCount / wordlePlayed * 100 || 0}</span>
            <span class="data-title">Ganados %</span>
        </div>
        
    </div>`

    container.innerHTML = statistics
    openModal(container)
}