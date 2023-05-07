
const input = document.querySelector('input')
const searchIcon = document.querySelector('.search-icon')
const modalInner = document.querySelector('.modal-inner')

function renderDefault() {

    input.value = 'keyboard'
    render()

}

function render() {

    const api = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

    fetch(api + input.value)
        .then(res => res.json())
        .then(data => {

            let word = ''
            let phonetic = ''
            let sound = ''

            for (let section of data) {
                word = section.word

                if (section.phonetic) {
                    phonetic = section.phonetic
                }

                for (let phonetic of section.phonetics) {

                    if (phonetic.audio) {
                        sound = phonetic.audio
                    }
                }
            }

            modalInner.innerHTML += `
            <div class="row heading">
                <div class="col-lg-9 title">
                    <h1>${word}</h1>
                    <p class="phonetic">${phonetic}</p>
                </div>
                <div class="col-lg-3 play-me">
                    <button class="playBtn"><i class="fa-solid fa-play fa-lg"></i></button>
                </div>
            </div>
            `

            setTimeout(() => {

                const audio = new Audio(sound)

                const playBtn = document.querySelector('.playBtn')

                playBtn.addEventListener('click', () => {
                    audio.play()
                })
            }, 100);


            for (let section of data) {
                for (let meaning of section.meanings) {
                    modalInner.innerHTML += `
                    <p class="partOfSpeech">${meaning.partOfSpeech}</p>
                    <p class="meaning">Meaning</p>
                    `
                    for (let def of meaning.definitions) {

                        modalInner.innerHTML += `
                        <ul class="definition"><li>${def.definition}</li></ul>
                        `
                        if (def.example) {
                            modalInner.innerHTML += `
                            <ul class="example">"${def.example}"</ul>
                            `
                        }
                    }

                    if (meaning.synonyms.length > 0) {
                        meaning.synonyms = meaning.synonyms.join(' - ')
                        modalInner.innerHTML += `
                        <div class="row synonyms">
                            <div class="col-lg-2 syn">
                                <span> Synonyms:</span>
                            </div>
                            <div class="col-lg-10 inline-syn">
                                <span>${meaning.synonyms}</span>
                            </div>
                        </div>
                        `
                    }
                }
            }
        })
}


renderDefault()

searchIcon.addEventListener('click', () => {

    modalInner.innerHTML = ''
    render()

})

input.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        modalInner.innerHTML = ''
        render()
    }
})