{
    const instructions = `<p>Adivina a <b>PALABRA</b> en 6 intentos.</p>
    <p>Cada intento ten que ser ua palabra de 5 lletras que exista. Apreta o botón “PROBA” pa intentar.</p>
    <p>
    Despos de cada intento, el color de cada caixa cambiara para que vexas o cerca que estas de adiviñar a palabra.
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
    <p>A lletra <b>B</b> ta na palabra e no sou sito.</p>
    <div class="instruction-boxes">
        <div class="box">p</div>
        <div class="box" data-state="present">o</div>
        <div class="box">r</div>
        <div class="box">t</div>
        <div class="box">o</div>
    </div>
    <p>A lletra <b>O</b> tan na palabra pero en mal sito.</p>
    <div class="instruction-boxes">
        <div class="box">n</div>
        <div class="box">o</div>
        <div class="box">i</div>
        <div class="box" data-state="wrong">r</div>
        <div class="box">o</div>
    </div>
    <p>A lletra <b>R</b> no tan a palabra.</p>
    <hr>
    <h2>Todos o días cambia a palabra por ua nova!</h2>`

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