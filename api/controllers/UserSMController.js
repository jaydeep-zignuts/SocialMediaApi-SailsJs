/**
 * UserSMController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
const { log } = require("grunt");
const jwt = require('jsonwebtoken');

module.exports = {
  
    signup: function(req, res){
        const email= req.body.email;
        const password= req.body.password;
        const role=req.body.role;
        const username=req.body.username;
        let profilePic=req.file('profilePic');
        let fileDest;

        UserSM.find({ email:email } && {username:username})
        .then((result)=>{
            if(result.length >= 1){
                return res.status(409).json({
                    message:"Please use Different email or username "
                })
            }else{
                profilePic.upload({ dirname: __dirname + '/../../upload' }, function onUploadComplete(err, files) {
                    if (err) return res.serverError(err);
                    console.log(files);
                    fileDest = files.pop()['fd'];
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err,
                            });
                        } else {

                            UserSM.create({
                                email: email,
                                password: hash,
                                role: role,
                                username: username,
                                profilePic:fileDest
                            })
                                .fetch()
                                .then((result) => {
                                    return res.status(201).json({
                                        data: result
                                    });
                                })
                                .catch((err) => {
                                    return res.status(500).json({

                                        error: err.message
                                    });
                                });
                        }
                    });
                })
            }
        }).catch((err)=>{
            return res.status(500).json({
                error: "err -->",err
            });
        });
    },
    login:function(req, res){
        const email= req.body.email;
        let password= req.body.password;
        const role=req.body.role;
        UserSM.find({email:email}).then((user)=>{
            if(user.length < 1){
                res.status(500).json({
                    message: "Please Register Youe Self...."
                });
            }
            console.log(user,password);
            bcrypt.compare(password, user[0].password, (err, result)=>{
                if(err){
                    return res.status(401).json({
                        message:"Auth Failed", err
                    });
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        id:user[0].id,
                        role:user[0].role
                    },
                    'secret',
                    {
                        expiresIn:'1d' 
                    });
                    res.cookie('token', token, { maxAge: 900000 });
    
                    return res.status(200).json({
                        message: "Login success",
                        token:token
                    });
                }
                res.status(401).json({
                    message: "Auth Failed ->",err
                });
            })         
        })
        .catch((err)=>{
            res.status(500).json({
                error: err,
            }); 
        })
    },

    logout:function(req, res){
        res.clearCookie('token');
        return res.status(200).json({
            message: 'logged Out...'
        })
    },
    changePassword:function(req, res){
        const newPassword=req.body.newPassword;
        console.log(newPassword);
        bcrypt.hash(newPassword, 10, (err, hash) => {
            console.log("hash",hash);
            if (err) {
                return res.status(500).json({
                    error: err,
                });
            } else {
                UserSM.update({id:req.userData.id}).set({
                    password: hash
                })
                .fetch()
                .then((result)=>{
                    return res.status(200).json({
                        message:"password change successfully",
                        data:result
                    });
                }).catch((err)=>{
                    return res.status(500).json({
                        error: err
                    });
                })
            }
        });
    },

    updateProfile: function(req, res){
        const email= req.body.email;
        const username=req.body.username;
        let profilePic=req.file('profilePic');
        let fileDest;
        profilePic.upload({ dirname: __dirname + '/../../upload' }, function onUploadComplete(err, files) {
            if (err) return res.serverError(err);
            console.log(files);
            fileDest = files.pop()['fd'];
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                } else {
                    UserSM.update({id:req.userData.id})
                    .set({
                        email:email,
                        username:username,
                        profilePic:fileDest
                    })  
                    .fetch()
                    .then((result)=>{
                        return res.status(200).json({
                            status:200,
                            data:result,
                        });
                    })
                    .catch((err)=>{
                        return res.status(500).json({
                            status:500,
                            data:err,
                        });
                    })
                }
            });

        });

       
    },
//following
    followUser: function(req,res){
        //current user id
        const cuid=req.userData.id;
        //id of user whom current user went to follow
        const userTofollowing=req.params.uid;
        console.log(cuid, userTofollowing);

        UserSM.findOne({id:cuid}).populate('following', { where: {id: userTofollowing}})
        .then((result)=>{
            console.log(result, "dfglkn");
            if(result.following.length>=1){
                return res.status(500).json({
                    message: "You already Follow This user"
                })
            }else{
                UserSM.addToCollection(userTofollowing, 'followers', cuid)
                .then((result) => {
                    return res.status(200).json({
                        status: 200,
                        data: result,
                    });
                }).catch((err) => {
                    return res.status(500).json({
                        status: 500,
                        data: err,
                    });
                });
            }
            

        });
        
    },

    getFollowers:function(req, res){
        const cuid=req.userData.id;

        UserSM.find({id:cuid}).populate("followers").then((result)=>{
            return res.status(200).json({
                data: result
            })
        }).catch((err)=>{
            return res.status(500).json({
                data: err
            })
        })
    },
    getFollowing: function(req, res){
        const cuid=req.userData.id;

        UserSM.find({id:cuid})
        .populate('following')
        .then((result)=>{
            return res.status(200).json({
                status:200,
                data: result
            })
        }).catch((err)=>{
            return res.status(500).json({
                status:500,
                data: err
            })
        })
    },

    viewProfile: function(req, res){
        const id=req.params.id;
        UserSM.findOne({id:id}).populate(['followers', 'following','posts','like','comment']).then((result)=>{
            return res.status(200).json({
                status:200,
                user: result
            })
        }).catch((err)=>{
            return res.status(200).json({
                status:500,
                error: err
            })
        })
    },

    unfollowUser: function(req,res){
        //current user id
        const cuid=req.userData.id;
        //id of user whom current user went to unfollow
        const userTounfollowing=req.params.uid;
        console.log(cuid, userTounfollowing);

        UserSM.findOne({id:cuid}).populate('following', { where: {id: userTounfollowing}})
        .then((result)=>{
            console.log("hello",result) ;

            if(result.following.length === 1){

                UserSM.removeFromCollection(cuid,'following',userTounfollowing).then((unfollow)=>{
                    console.log(unfollow, "dfgkj");
                    return res.status(200).json({
                        data: unfollow
                    });
                }).catch((err)=>{
                    return res.status(500).json({
                        status:500,
                        error: err
                    })
                })
            }else{
                return res.status(500).json({
                    status:500,
                    error: "0 Following"
                })
            }

        }).catch((err)=>{
            return res.status(200).json({
                status:500,
                error: err
            })
        })
        
        
    },

    adminActiveUser: function (req, res) {
        const uid = req.params.uid;
        UserSM.findOne({ id: uid })
        .then((result) => {
            if (result.length > 1) {
                return res.status(200).json({
                    data: "User Not Found"
                });
            } else {
                UserSM.update({ id: uid })
                    .set({ isActiveUser: true })
                    .fetch()
                    .then((result) => {
                        return res.status(200).json({
                            data: result
                        });
                    }).catch((err) => {
                        return res.status(200).json({
                            status: 500,
                            error: err
                        })
                    });
                }   
            })
            .catch((err) => {
            return res.status(200).json({
                status: 500,
                error: err
            })
        });

    },
    adminInactiveUser: function (req, res) {
        const uid = req.params.uid;
        UserSM.findOne({ id: uid })
        .then((result) => {
            if (result.length > 1) {
                return res.status(200).json({
                    data: "User Not Found"
                });
            } else {
                UserSM.update({ id: uid })
                    .set({ isActiveUser: false })
                    .fetch()
                    .then((result) => {
                        return res.status(200).json({
                            data: result
                        });
                    }).catch((err) => {
                        return res.status(200).json({
                            status: 500,
                            error: err
                        })
                    });
                }   
            })
            .catch((err) => {
            return res.status(200).json({
                status: 500,
                error: err
            })
        });

    },
    viewPostOfUser: function(req, res){
        const id=req.params.uid;
        UserSM.find({id:id}).populate('posts',{sort:{createdAt:-1}}).then((result)=>{
            return res.status(200).json({
                status:200,
                user: result
            })
        }).catch((err)=>{
            return res.status(200).json({
                status:500,
                error: err
            })
        })
    },

    allUsers: function(req, res){
        const id=req.params.uid;
        const skip=req.query.skip;
        const limit=req.query.limit;
        const search=req.query.search;

        if(search===""){
            UserSM.find({}).populateAll().limit(limit).skip(skip*limit).then((result)=>{
                return res.status(200).json({
                    status:200,
                    user: result
                })
            }).catch((err)=>{
                return res.status(200).json({
                    status:500,
                    error: err
                })
            })
        }else{
            UserSM.find({username:search}).populateAll().limit(limit).skip(skip*limit).then((result)=>{
                return res.status(200).json({
                    status:200,
                    user: result
                })
            }).catch((err)=>{
                return res.status(200).json({
                    status:500,
                    error: err
                })
            })
        }
       
    },

};

  