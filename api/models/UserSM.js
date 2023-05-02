/**
 * UserSM.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    email: {
      type:'string',
      required: true,
      isEmail:true
    },
    password: {
      type: 'string',
      required: true,
      minLength:8,
      maxLength:100,
    },
    role:{
      type:'string',
      defaultsTo:'user' 
    },
    username: {
      type:'string',
      unique: true,
      required: true
    },
    
    profilePic:{
      type:'string',
      required:true
    },

    isActiveUser:{
      type: 'boolean',
      defaultsTo: true
    }, 
 
    posts:{  
      collection: 'PostSM', 
      via: 'userpost' 
    },

    like:{
      collection:'LikeDisLikeSM',
      via:'userId'
    },

    comment:{
      collection:'CommentSM',
      via:'userId'
    },

    
    following: {
      collection: 'UserSM',
      via: 'followers'
    },
    followers: {
      collection: 'UserSM',
      via: 'following'
    },


  },

};

