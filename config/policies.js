/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  PostSMController:{
    '*':'isUser'
  },

  UserSMController:{
    changePassword: 'isUser',
    updateProfile:'isUser',
    followUser:'isUser',
    getFollowers:'isUser',
    getFollowing:'isUser',
    viewProfile:'isUser',
    unfollowUser:'isUser',

    adminActiveUser:'isAdmin',
    adminInactiveUser:'isAdmin',
    viewPostOfUser:'isAdmin',
    allUsers:'isAdmin',

  },


};
