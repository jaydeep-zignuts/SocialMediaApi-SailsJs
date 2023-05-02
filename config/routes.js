/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'POST /user/signup' : 'UserSMController.signup',
  'POST /user/login' : 'UserSMController.login',
  'GET /user/logout' : 'UserSMController.logout',
  'POST /user/changePassword' : 'UserSMController.changePassword',
  'PUT /user/updateProfile' : 'UserSMController.updateProfile',

  //********************************************************************************************************
  // Post routes

  'POST /user/createPost': 'PostSMController.createPost',
  'GET /user/getPosts': 'PostSMController.getPosts',
  'POST /user/likePost/:pid' : 'PostSMController.likePost',
  'POST /user/dislikePost/:pid' : 'PostSMController.dislikePost',
  'POST /user/commentPost/:pid' : 'PostSMController.commentPost',

  'POST /user/followUser/:uid' : 'UserSMController.followUser',
  'GET /user/getFollowers' : 'UserSMController.getFollowers',
  'GET /user/getFollowing' : 'UserSMController.getFollowing',
  'GET /user/viewProfile/:id' : 'UserSMController.viewProfile',
  'GET /user/unfollowUser/:uid' : 'UserSMController.unfollowUser',



  'PUT /admin/adminActiveUser/:uid' : 'UserSMController.adminActiveUser',
  'PUT /admin/adminInactiveUser/:uid' : 'UserSMController.adminInactiveUser',
  'GET /admin/viewPostOfUser/:uid' : 'UserSMController.viewPostOfUser',
  'GET /admin/allUsers' : 'UserSMController.allUsers',
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
