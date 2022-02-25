
function setOverlayContainerAnimation(animationName, animationEndFunction) {
    overlayContainer.dataset.animation = animationName
    overlayContainer.addEventListener('animationend', () => {
        delete overlayContainer.dataset.animation
        animationEndFunction && animationEndFunction()
    }, { once: true })
}



function hideSettings() {
    setOverlayContainerAnimation('fade-out', () => {
        while (overlayContainer.children.length > 1) {
            overlayContainer.removeChild(overlayContainer.lastChild)
        }
        overlayContainer.style.display = "none"
    })
}

function revealSettings() {
    const container = document.createElement('div')
    container.setAttribute('id', 'settings-container')
    const content = `
        <h2>Settings</h2>
        <div class="settings-body">
            <div class="toggle-body">
                <span>Dark theme</span>
                <label class="toggle dark-mode" onclick="toggleDarkMode()" title="Cambiar a modo oscuro">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-body">
                <span>High contrast mode</span>
                <label class="toggle high-contrast" onclick="toggleHighContrastMode()" title="Cambiar a modo alto contraste">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <footer>
            <div class="texto copyright">
                ©️ 2022
                <a                 </a>
            </div>
            <div class="redes sociales">
                
                
            </div>
        </footer>
    `

    container.innerHTML = content
    overlayContainer.style.display = 'flex'
    setOverlayContainerAnimation('zoom-in')
    overlayContainer.appendChild(container)
}