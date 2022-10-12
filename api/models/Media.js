module.exports = {

    connection: 'cgdev',
    schema: false,
    migrate: 'safe',
    tableName: 'upload_file',

    attributes: {

        id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
        },

        url: {
            type: 'string',
            required: true,
            maxLength: 50
        }

    }

};

