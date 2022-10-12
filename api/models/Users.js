module.exports = {

    migrate: 'safe',
    schema: true,

    attributes: {

        id: {
            type: 'integer',
            unique: true,
            primaryKey: true,
            index: true
        },

        dmm_id: {
            type: 'integer'
        },

        department: {
            type: 'string'
        },

        level: {
            type: 'string'
        },

        site: {
            type: 'string',
            index: true,
            required: true
        },

        first_name: {
            type: 'string',
            maxLength: 50
        },

        last_name: {
            type: 'string',
            maxLength: 50
        },

        role: {
            type: 'string',
            required: true,
            defaultsTo: 'User'
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
            type: 'string',
            maxLength: 150
        },

        online: {
            type: 'boolean',
            defaultsTo: false
        },

        createdAt: {
            type: 'date'
        },

        updatedAt: {
           type: 'date'
        },
        toObject: function(){
            var self = this;
            delete self.encryptedPassword;
            return self;
        },
        toJSON: function(){
            var obj = this.toObject();
            return obj;
        }

    }

};
