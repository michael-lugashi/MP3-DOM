/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */

/* plays the next song automatically */
function nextSong(songId) {
    if (findIndex(songId, player.songs) + 1 < player.songs.length) {
        const next = player.songs[findIndex(songId, player.songs) + 1].id
        playSong(next)
    } else {
        const lastSong = document.getElementsByClassName("songSelected")
        lastSong[0].classList.remove("songSelected")
    }
}

/*  plays the song for its given length */
function playSong(songId) {
    const song = document.getElementById(`song${songId}`)
    const lastSong = document.getElementsByClassName("songSelected")
    if (lastSong[0]) lastSong[0].classList.remove("songSelected")
    song.classList.add("songSelected")
    setTimeout(nextSong, 1000 * player.songs[findIndex(songId, player.songs)].duration, songId)

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
    return createElement("div", [coverEl, titleEl, albumEL, artistEl, durEl], ["song"], {
        onclick: `playSong(${id})`,
        id: `song${id}`,
    })
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */

function createPlaylistElement({ id, name, songs }) {
    const nameEl = createElement("h2", [name], [])
    const numSongs = createElement("h2", [`Songs: ${songs.length}`], [])
    const playlistDurationEl = createElement("h2", [playlistDuration(id)], [], {})
    return createElement("div", [nameEl, numSongs, playlistDurationEl], ["playlists"], {
        onclick: `playPlaylist(${id})`,
        id: `playlist${id}`,
    })
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
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

// You can write more code below this line

/* Converts number seconds into string of min in correct format */
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

/*  adds the html elements to the page  */
function buildMp3() {
    const songsHtml = document.getElementById("songs")
    const playliststHtml = document.getElementById("playlists")

    // sorts the songs and playlists objects by there names and titles respectively
    player.playlists.sort((playlistA, playlistB) => playlistA.name.localeCompare(playlistB.name))
    player.songs.sort((SongA, SongB) => SongA.title.localeCompare(SongB.title))

    // creates elements for all the songs and playlists
    for (let song of player.songs) {
        songsHtml.appendChild(createSongElement(song))
    }
    for (let playlist of player.playlists) {
        playliststHtml.appendChild(createPlaylistElement(playlist))
    }
}
buildMp3()

