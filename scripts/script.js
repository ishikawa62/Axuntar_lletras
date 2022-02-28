
// Define alguna felicitaciones para el ganador
const allWishes = ['Ben feito', 'Muito ben', 'Ben feito', 'Muito ben', 'Ben feito', 'Muito ben', 'Ben feito', 'Muito ben', 'Ben feito']

// variables constantes
const board = document.getElementById('letter-board')
const keyboard = document.getElementById('keyboard')
const overlayContainer = document.getElementById('overlay-container')
const modal = document.getElementById('modal-container')

const releaseDate = new Date(2022, 1, 6)
const today = Date.now()
const dayIndex = Math.floor((today - releaseDate.valueOf()) / (1000 * 60 * 60 * 24))

// duracion de las animaciones
const FLIP_DURATION = 500
const POP_DURATION = 100
const SHAKE_DURATION = 600
const BOUNCE_DURATION = 1000


// pilla datos del fichero json 
let dictionary, todaysWord
loadAllData()
async function loadAllData() {
    const getDictionary = await fetch('dictionary.json')
    const getAllWords = await fetch('targetWords.json')
    dictionary = await getDictionary.json()
    allWords = await getAllWords.json()
    todaysWord = allWords[dayIndex]
    allowInput()
}

// permite la entrada
function allowInput() {
    keyboard.addEventListener('click', processMouseClick)
    document.addEventListener('keyup', processKeyboardType)
}
// bloque la entrada de letras
function blockInput() {
    keyboard.removeEventListener('click', processMouseClick)
    document.removeEventListener('keyup', processKeyboardType)
}

// funcionalidad de teclado para ordenadores
function processKeyboardType(e) {
    (e.key.match(/^[a-z]$/) || e.key === "Enter" || e.key === "Backspace") && processInput(e.key)
}
// funcionalidad de teclado en pantalla
function processMouseClick(e) {
    if (e.target.tagName === "BUTTON") {
        e.target.dataset.key && processInput(e.target.dataset.key)
        e.target.dataset.animation = 'pop'
        e.target.addEventListener('animationend', () => e.target.dataset.animation = 'idle', { once: true })
    }
}

// pilla las 5 cajas rellenas
const getActiveBoxes = () => [...board.querySelectorAll('.box[data-state="active"]')]
// pilla las cajas vacias
const getEmptyBoxes = () => [...board.querySelectorAll('.box[data-state="empty"]')]
// anima la caja de la letra
const setBoxAnimationState = (box, state) => box.dataset.animation = state

// crea notificacion de fallo
const createAlert = (alert, duration = 1000) => {
    const container = document.getElementById('alerts-container')
    container.style.display = 'block'
    const div = document.createElement('div')
    div.classList.add('alert')
    div.textContent = alert
    container.prepend(div)
    setTimeout(() => {
        div.dataset.animation = 'fade-out'
        div.addEventListener('animationend', () => container.removeChild(div), { once: true })
    }, duration)
}

// procesa las letras entradas
function processInput(key) {
    const activeBoxes = getActiveBoxes()
    if (key === "Enter") {
        processSubmit()
        return
    } else if (key === "Backspace") {
        processDelete()
        return
    } else if (activeBoxes.length < 5) {
        const nextBox = getEmptyBoxes()[0]
        if (!nextBox) return
        nextBox.textContent = key
        nextBox.dataset.letter = key
        nextBox.dataset.state = 'active'
        setBoxAnimationState(nextBox, 'pop')
        nextBox.addEventListener('animationend', () => setBoxAnimationState(nextBox, 'idle'), { once: true })
    }
}

// borras las cajas de letras
function processDelete() {
    const activeBoxes = getActiveBoxes()
    if (activeBoxes.length === 0) return
    const lastBox = activeBoxes.pop()
    lastBox.textContent = ""
    lastBox.dataset.state = 'empty'
    delete lastBox.dataset.letter
}

// comprueba la prueba del usuario
function processSubmit(boxes = getActiveBoxes(), checkWinner = true) {
    blockInput() // primero impedir la entrada de mas letras

    // prueba si las 5 letras estan o no
    if (boxes.length < 5) {
        createAlert("Faltan lletras")
        allowInput()
        return
    }

    // pilla todas las letras
    const submission = boxes.reduce((word, box) => word + box.dataset.letter, "")

    // animacion para palabra desconocida
    if (dictionary && !dictionary.includes(submission)) {
        createAlert("palabra non existe")
        boxes.forEach((box, i) => {
            box.dataset.animation = "shake"
            setTimeout(() => boxes.forEach(box => box.dataset.animation = "idle"), SHAKE_DURATION)
        })
        allowInput()
        return
    }

    checkWinner && AutoSaveToLocalStorage() // guarda los datos en el almacenamiento local

    boxes.forEach((box, index) => {
        setTimeout(() => {
            setBoxAnimationState(box, 'flip-in') // da la vuelta y animacion

            // arranca la nueva funcion despues de que la animacion termine
            box.addEventListener('animationend', () => {
                // añadir el estado de letra probada en cuadro anterior
                if (todaysWord[index] === box.textContent) {
                    box.dataset.state = 'correct'
                    keyboard.querySelector(`[data-key="${todaysWord[index]}"]`).dataset.state = 'correct'
                } else if (todaysWord.includes(box.textContent)) {
                    box.dataset.state = 'present'
                    keyboard.querySelector(`[data-key="${box.textContent}"]`).dataset.state = 'present'
                } else {
                    box.dataset.state = 'wrong'
                    keyboard.querySelector(`[data-key="${box.textContent}"]`).dataset.state = 'wrong'
                }

                setBoxAnimationState(box, 'flip-out') // para la animacion

                // restarura la animacion
                box.addEventListener('animationend', () => setBoxAnimationState(box, 'idle'), { once: true })


                // probar si perdio o gano
                if (checkWinner && index === boxes.length - 1) {
                    if ((boxes.filter(box => box.dataset.state === 'correct')).length === 5) {
                        // enseña la notificacion
                        createAlert(allWishes[Math.round(Math.random() * (allWishes.length - 1))], 5000)

                        boxes.forEach((box, i) => {
                            setTimeout(() => {
                                box.dataset.animation = "bounce"
                                box.addEventListener('animationend', () => boxes.forEach(box => box.dataset.animation = "idle"), { once: true })
                            }, 100 * i)
                        })

                        const savedData = getSavedData()
                        const lastWin = new Date(savedData?.lastWinDate) || undefined
                        const today = new Date()
                        const currentStreak = lastWin ? ((lastWin.getDate() === today.getDate - 1 && lastWin.getMonth() === today.getMonth() && lastWin.getFullYear() === today.getFullYear()) ?
                            savedData.currentStreak + 1 : 1) : 1;
                        const maxStreak = savedData.maxStreak ? (savedData.maxStreak < currentStreak ? currentStreak : savedData.maxStreak)
                            : currentStreak;
                        saveDataInLocalStorage({
                            wordlePlayed: savedData?.wordlePlayed + 1 || 1,
                            wordleWinCount: savedData?.wordleWinCount + 1 || 1,
                            lastWinDate: Date.now(),
                            currentStreak, maxStreak
                        })
                    }
                    // prueba si algo cambia a la izq o no
                    else if (getEmptyBoxes().length === 0) {
                        // enseña notificacion si nada cambia
                        createAlert(`Erro: a palabra de hoi é "${todaysWord.toUpperCase()}"`, 9000)
                        saveDataInLocalStorage({
                            wordlePlayed: getSavedData()?.wordlePlayed + 1 || 1,
                            currentStreak: 1
                        })
                    }
                    else {
                        // permitir la entrada despues de la prueba
                        allowInput()
                    }
                }
            }, { once: true })

        }, FLIP_DURATION * (index + 1) / 2)
    })
}

// pilla los datos del almacenamiento local
function getSavedData() {
    return JSON.parse(localStorage.getItem("user-data"))
}
// guarda los datos en el almacenamiento local
function saveDataInLocalStorage(data) {
    const savedData = getSavedData() || {}
    const newData = { ...savedData, ...data }
    localStorage.setItem('user-data', JSON.stringify(newData))
}

getFromLocalStorage()
function getFromLocalStorage() {
    const savedData = getSavedData()

    // no pasa nada si no hay datos guardados
    if (!savedData) return

    const { letters } = savedData
    const previousDate = new Date(savedData.lastPlayedDate)
    const currentDate = new Date()

    // si los datos son de otro dia no hago nada
    if (currentDate.getDate() !== previousDate.getDate()) return

    // recupera todas las letras guardadas del dia en curso
    letters.forEach(letter => {
        const nextBox = getEmptyBoxes()[0]
        if (!nextBox) return
        nextBox.textContent = letter
        nextBox.dataset.letter = letter
        nextBox.dataset.state = 'active'
    })
    // ejecuta todas las letras una por una
    for (let i = 0; i <= (letters.length - 5); i++) {
        i % 5 || processSubmit(getActiveBoxes().slice(i, i + 5), false)
    }
}


function AutoSaveToLocalStorage() {
    const filledBoxes = [...board.querySelectorAll(':not(.box[data-state="empty"])')]
    const letters = filledBoxes.map(box => box.dataset.letter)
    const date = Date.now()
    const previousData = getSavedData() || {}
    saveDataInLocalStorage({ ...previousData, letters, lastPlayedDate: date })
}



// escucha modal
function openModal(elements) {
    modal.style.display = 'flex'
    modal.dataset.animation = 'zoom-in'
    modal.appendChild(elements)

    modal.addEventListener('click', () => {
        modal.dataset.animation = 'fade-out'
        modal.addEventListener('animationend', () => {
            modal.style.display = 'none'
            modal.lastChild && modal.removeChild(modal.lastChild)
        }, { once: true })
    }, { once: true })
}