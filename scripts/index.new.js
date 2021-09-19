/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {Number} songIdInPlayer - the ID of the song to play
 */

// This calls the playSong Function on the next song
function nextSong(songIdInPlayer) {
    if (findIndex(songIdInPlayer, player.songs) + 1 < player.songs.length) {
        const nextSongId = player.songs[findIndex(songIdInPlayer, player.songs) + 1].id
        playSong('song' + nextSongId)
    } else {
        const lastSong = document.getElementsByClassName("songSelected")
        lastSong[0].classList.remove("songSelected")
    }
}

// This plays the song and lets it play for the duration of the song
function playSong(songId) {
    
    const songIdInPlayer = idInPlayer(songId);
    const songInPlayer = player.songs[findIndex(songIdInPlayer, player.songs)]


    const lastSong = document.getElementsByClassName("songSelected")
    if (lastSong[0]) lastSong[0].classList.remove("songSelected")

    const songDom = document.getElementById(songId)
    songDom.classList.add("songSelected")
    setTimeout(nextSong, 10 * songInPlayer.duration, songIdInPlayer)
}

/**
 * Removes a song from the player, and updates the DOM to match.
 *
 * @param {Number} songId - the ID of the song to remove
 */
function removeSong(songId) {

    // removes songs from the player
    player.songs.splice(findIndex(idInPlayer(songId), player.songs), 1)
    player.playlists.forEach(playlist => playlist.songs = playlist.songs.filter(id => !(id === idInPlayer(songId))));

    // removes songs from the DOM
    document.getElementById(songId).remove()
    let playlists = document.querySelectorAll('.playlists')
    for (let rem of playlists) {
        rem.remove()
    }
    generatePlaylists()

}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({ id, title, album, artist, duration, coverArt }) {
    // I add the song to the object of songs
    player.songs.push({ id, title, album, artist, duration: convertToSec(duration), coverArt })
    player.songs.sort((SongA, SongB) => SongA.title.localeCompare(SongB.title))

    // I get all the songs in the DOM
    const allSongs = document.querySelectorAll(".song")

    // I find the index of the new song in the player and use it to find where it belongs in the DOM
    const indexOfNewSong = findIndex(id, player.songs)
    songs.insertBefore(createSongElement(player.songs[indexOfNewSong]), allSongs[indexOfNewSong])
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    // The click event only performs a tast when a button is pressed.
    if (event.target.tagName !== 'BUTTON') return;
    // The task performed is dependent on what button is pressed
    if (event.target.textContent === '❌') removeSong(event.target.closest('.song').id);
    if (event.target.textContent === '🥁') playSong(event.target.closest('.song').id);
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    // I create the new song object with the values of all the inputs
    const song = {
        id: createId(),
        title: inputs.children[0].value,
        album: inputs.children[1].value,
        artist: inputs.children[2].value,
        duration: inputs.children[3].value,
        coverArt: inputs.children[4].value
    }

    addSong(song)
}

/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const coverEl = createElement("img", [], ["img-format"], { src: coverArt })
    const titleEl = createElement("p", [title], ["width"])
    const albumEL = createElement("p", [album], ["width"])
    const artistEl = createElement("p", [artist], ["width"])
    const durEl = createElement("p", [convertToMin(duration)], ["width"])
    const playBtnEl = createElement("button", ["🥁"], [])
    const delBtnEl = createElement("button", ["❌"], [])
    const btns = createElement(
        "span",
        [createElement("button", ["🥁"], ["btn"]), createElement("button", ["❌"], ["btn"])],
        ["btns"]
    )
    return createElement("div", [coverEl, titleEl, albumEL, artistEl, durEl, btns], ["song"], {id: `song${id}`})
}
/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const nameEl = createElement("span", [name], [])
    const numSongs = createElement("span", [`Songs: ${songs.length}`], [])
    const playlistDurationEl = createElement("span", [playlistDuration(id)], [], {})
    return createElement("div", [nameEl, numSongs, playlistDurationEl], ["playlists"], { id: `playlist${id}`})
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"}, {click: (...) => {...}})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 * @param {Object} eventListeners - the event listeners on the element
 */
function createElement(tagName, children = [], classes = [], attributes = {}) {
    // creates the element
    let element = document.createElement(tagName)

    // adds all the classes to the element
    for (const cls of classes) {
        element.classList.add(cls)
    }
    // adds attributes to the element
    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute])
    }
    // adds all the children elements
    for (const child of children) {
        element.append(child)
    }
    return element
}

/**
 * Inserts all songs in the player as DOM elements into the songs list.
 */
function generateSongs() {
    const songsHtml = document.getElementById("songs")

    player.songs.sort((SongA, SongB) => SongA.title.localeCompare(SongB.title))

    for (let song of player.songs) {
        songsHtml.appendChild(createSongElement(song))
    }
}

/**
 * Inserts all playlists in the player as DOM elements into the playlists list.
 */
function generatePlaylists() {
    const playliststHtml = document.getElementById("playlists")

    player.playlists.sort((playlistA, playlistB) => playlistA.name.localeCompare(playlistB.name))

    for (let playlist of player.playlists) {
        playliststHtml.appendChild(createPlaylistElement(playlist))
    }
}

/* Functions that aid and aquire information for my about functions */
function idInPlayer(songId){
    return Number(songId.replace(/\D/g, ''))
}
function createId(id) {
    while (id === undefined || findIndex(id, player.songs) > -1) {
        id = Math.floor(Math.random() * 100)
    }
    return id
}

function convertToSec(minutes) {
    return Number(minutes.slice(0, 2)) * 60 + Number(minutes.slice(3, 5))
}

function convertToMin(seconds) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`
}

function findIndex(id, location) {
    return location.findIndex((listElement) => listElement.id === id)
}

function playlistDuration(id) {
    let totalDuration = 0
    const playlist = player.playlists[findIndex(id, player.playlists)]
    playlist.songs.forEach((songId) => (totalDuration += player.songs[findIndex(songId, player.songs)].duration))
    return convertToMin(totalDuration)
}

// Creating the page structure
generateSongs()
generatePlaylists()

// Making the add-song-button actually do something
document.getElementById("add-button").addEventListener("click", handleAddSongEvent)
songs.addEventListener('click', handleSongClickEvent)