/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
 function playSong(songId) {
    // Your code here
}

/**
 * Creates a song DOM element based on a song object.
 */
 function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const children = [
        createElement("p", title, ["inline"], {}),
        createElement("p", album, ["inline"], {}),
        createElement("p", artist, ["inline"], {}),
        createElement("p", convertToMin(duration), ["inline"], {}),
        createElement("img", null, ["img-format"], { src: coverArt }),
    ]
    const classes = ["songs"]
    const attrs = { onclick: `playSong(${id})`, id }
    return createElement("div", children, classes, attrs)
}
/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const children = []
    const classes = []
    const attrs = {}
    return createElement("div", children, classes, attrs)
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
    // Your code here
}

// You can write more code below this line

function changeHtml() {
    const songsHtml = document.getElementById("songs")
    const playliststHtml = document.getElementById("playlists")
    player.playlists.sort((playlistA, playlistB) => playlistA.name.localeCompare(playlistB.name))
    player.songs.sort((SongA, SongB) => SongA.title.localeCompare(SongB.title))
    for (let song of player.songs) {
        songsHtml.appendChild(createSongElement(song))
    }
    for (let playlist of player.playlists) {
        playliststHtml.appendChild(createPlaylistElement(playlist))
    }
}
changeHtml()