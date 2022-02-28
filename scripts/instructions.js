{
    const instructions = `<p>Adivía a <b>PALABRA</b> en 6 intentos.</p>
    <p>Cada intento ten que ser úa palabra de 5 letras que exista nel dicionario de Varela Aenlle.</p>
    <p>
    Apreta el botón “PROBA” pra comenzar a xogar.
    </p>
    <p>
    Despós de cada intento, a color de cada caxa cambiará pra que vexas lo cerca que tás de adiviar a palabra.
    </p>
    <hr>
    <h4>Exemplos</h4>
    <div class="instruction-boxes">
        <div class="box" data-state="correct">b</div>
        <div class="box">e</div>
        <div class="box">i</div>
        <div class="box">r</div>
        <div class="box">a</div>
    </div>
    <p>A letra <b>B</b> tá na palabra e nel sou sito.</p>
    <div class="instruction-boxes">
        <div class="box">p</div>
        <div class="box" data-state="present">o</div>
        <div class="box">r</div>
        <div class="box">t</div>
        <div class="box">o</div>
    </div>
    <p>A letra <b>O</b> tá na palabra, pero mal colocada.</p>
    <div class="instruction-boxes">
        <div class="box">n</div>
        <div class="box">o</div>
        <div class="box">i</div>
        <div class="box" data-state="wrong">r</div>
        <div class="box">o</div>
    </div>
    <p>A letra <b>R</b> non tá na palabra.</p>
    <hr>
    <h2>¡Todos os días hai úa nova palabra!</h2>`

    const newUser = !getSavedData()?.lastPlayedDate
    newUser && showInstructions()

    function showInstructions() {
        const container = document.createElement('div')
        container.setAttribute('id', 'instructions-container')

        container.innerHTML = instructions
        const boxesWithState = [...container.querySelectorAll('[data-state]')]
        setTimeout(() => {
            boxesWithState.forEach(box => {
                box.dataset.animation = 'flip-in'
                box.addEventListener('animationend', () => {
                    box.dataset.animation = 'flip-out'
                    box.addEventListener('animationend', () => delete box.dataset.animation)
                }, { once: true })
            })
        }, 1000)
        openModal(container)
    }


    function showInstructionsOverlay() {
        const container = document.createElement('div')
        container.setAttribute('id', 'instructions-container')

        container.innerHTML = `<h1>Como se xoga</h1><hr>` + instructions
        const boxesWithState = [...container.querySelectorAll('[data-state]')]
        setTimeout(() => {
            boxesWithState.forEach(box => {
                box.dataset.animation = 'flip-in'
                box.addEventListener('animationend', () => {
                    box.dataset.animation = 'flip-out'
                    box.addEventListener('animationend', () => delete box.dataset.animation)
                }, { once: true })
            })
        }, 1000)

        overlayContainer.style.display = 'flex'
        setOverlayContainerAnimation('zoom-in')
        overlayContainer.appendChild(container)
    }
}