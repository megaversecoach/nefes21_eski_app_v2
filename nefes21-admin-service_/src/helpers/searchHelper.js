const { MeiliSearch } = require('meilisearch');
const Author = require('../models/nefes21/authorsModel');
const Content = require('../models/nefes21/contentModel');
const ContentType = require('../models/nefes21/contentTypeModel');
const config = require('config');

function updateSearchFile() {
    return new Promise(async (resolve, reject) => {
        const contents = await Content.find({}, { _id: 0 }).lean();

        const author = await Author.find({}, { _id: 0 }).lean();
        const contentTypeList = await ContentType.find({}, { _id: 0 }).lean();
        let searchDocument = contents;

        searchDocument.forEach(async (item) => {
            let authorObject = author.find(i => i.author_id === item.author_id);
            let contentTypeObject = contentTypeList.find((i) => (i.content_type_id === item.content_type_id && item.language === i.language));

            item = Object.assign(item,
                {
                    "author_name": authorObject.author_name,
                    "author_surname": authorObject.author_surname,
                    "author_label": authorObject.author_label,
                    "content_type_label": contentTypeObject.content_type_label
                });
        });

        const client = new MeiliSearch({ host: `http://${config.get('Server.serverIP')}:7700` });

        client.index('content').deleteAllDocuments()
            .then(() => { 
                client.index('content').addDocuments(searchDocument)
                console.log('Search file Updated');
            })
            .then(() => {
                client.index('content').updateSettings({
                    rankingRules: [
                        'typo',
                        'words',
                        'proximity',
                        'attribute',
                        'wordsPosition',
                        'exactness',
                        'desc(release_date)',
                        'desc(rank)'
                    ],
                    distinctAttribute: 'content_id',
                    searchableAttributes: [
                        "content_title",
                        "author_name",
                        "author_surname"
                    ]
                });
            })
            .catch((error) => {
                console.log("Meili Error : ", error)

            });
    });
}

module.exports = {
    updateSearchFile
}