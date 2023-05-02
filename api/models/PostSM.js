/**
 * PostSM.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    postImage:{
      type:'string',
      required: true
    },
    postCaption:{
      type:'string'
    },
    postTitle:{
      type:'string'
    },

    userpost:{
      model: 'UserSM'
    },

    likePost:{
      collection:'LikeDisLikeSM',
      via:'postId'
    },
    comment:{
      collection:'LikeDisLikeSM',
      via:'postId'
    }
  },

};

