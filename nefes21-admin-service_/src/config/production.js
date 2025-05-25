"use strict";

module.exports = {
    "Db": {
        "nefes21URL": `mongodb://nefes21:mXCR7d5w9tYT@localhost:27017/${process.env.DB_NAME}?authSource=admin`,
        "nefes21AdminURL": `mongodb://nefes21:mXCR7d5w9tYT@localhost:27017/${process.env.ADMIN_PANEL_DB_NAME}?authSource=admin`,
        "nefes21AnalyticsURL": `mongodb://nefes21:mXCR7d5w9tYT@localhost:27017/${process.env.ANALYTICS_DB_NAME}?authSource=admin`
    },
    "Server": {
        "port": 2120,
        "serverIP": '89.163.135.3',
    },
    "Jwt" : {
        "secretKey" : "NektarNefes21"
    },
    "FilePaths" : {
        "tempPath" : "/srv/private-assets/drafts/temp",
        "draftAuthorHeaderPic" :  "/srv/assets/drafts/images/author-headers",
        "authorHeaderPic" : "/srv/assets/images/author-headers",
        "draftAuthorProfilePic" :  "/srv/assets/drafts/images/author-profiles",
        "authorProfilePic" :  "/srv/assets/images/author-profiles",
        "draftNarratorProfilePic" :  "/srv/assets/drafts/images/narrator-profiles",
        "narratorProfilePic" :  "/srv/assets/images/narrator-profiles",
        "soundscapeCoverPic" : "/srv/assets/images/soundscape-covers",
        "draftSoundscapeCoverPic" : "/srv/assets/drafts/images/soundscape-covers",
        "soundscapeAudio" : "/srv/private-assets/audios/soundscapes",
        "draftSoundscapeAudio" : "/srv/private-assets/drafts/audios/soundscapes",
        "draftContentCover" : "/srv/assets/drafts/images/content-covers",
        "contentCover" : "/srv/assets/images/content-covers",
        "contentShowcase" : "/srv/assets/images/content-showcases",
        "draftContentShowcase" : "/srv/assets/drafts/images/content-showcases",
        "drafTracks" : "/srv/private-assets/drafts/audios/tracks",
        "tracks" : "/srv/private-assets/audios/tracks",
        "showcases" : "/srv/assets/images/today-showcases",
        "draftProgramCover" : "/srv/assets/drafts/images/program-covers",
        "programCover" : "/srv/assets/images/program-covers",
        "draftProgramBackground" : "/srv/assets/drafts/images/program-backgrounds",
        "programBackground" : "/srv/assets/images/program-backgrounds",
        "draftTrailerCover" : "/srv/assets/drafts/images/program-trailer-covers",
        "trailerCover" : "/srv/assets/images/program-trailer-covers",
        "draftTrailerMp4" : "/srv/assets/drafts/videos/program-trailers",
        "trailerMp4" : "/srv/assets/videos/program-trailers",
        "draftPartVideo" : "/srv/private-assets/drafts/videos/parts",
        "partVideo" : "/srv/private-assets/videos/parts",
        "draftPartAudio" : "/srv/private-assets/drafts/audios/parts",
        "partAudio" : "/srv/private-assets/audios/parts"
    }
}