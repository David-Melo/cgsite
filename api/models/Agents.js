module.exports = {

    connection: 'cgdev',
    schema: false,
    migrate: 'safe',
    tableName: 'cg_agents',

    attributes: {

        id: {
            type: 'integer',
            unique: true
        },

        name: {
            type: 'string',
            required: true,
            maxLength: 50
        },

        title: {
            type: 'string',
            maxLength: 50
        },

        role: {
            type: 'string',
            required: true,
            defaultsTo: 'User'
        },

        url: {
            type: 'string'
        },

        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true,
            maxLength: 100
        },

        phone: {
            type: 'string'
        },

        encryptedPassword: {
            type: 'string'
        },

        image: {
           model: 'media'
        },

        online: {
            type: 'boolean',
            defaultsTo: false
        },

        listed: {
            type: 'boolean',
            defaultsTo: false
        },

        createdAt: {
            type: 'date'
        },

        updatedAt: {
            type: 'date'
        },

        toJSON: function(){
            var obj = this.toObject();
            delete obj.password;
            delete obj.confirmation;
            delete obj.encryptedPassword;
            return obj;
        }

    }

};

