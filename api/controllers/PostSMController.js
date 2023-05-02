/**
 * PostSMController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { log } = require("grunt");

module.exports = {

    createPost: function(req, res) {
        let postTitle= req.body.postTitle;
        let postCaption= req.body.postCaption;
        // const userpost=req.params.userpost;
        const postImage=req.file('postImage');
        let fileDest;
        console.log(req.body , req.params);
        postImage.upload({ dirname: __dirname + '/../../upload' }, function onUploadComplete(err, files) {
            if (err) return res.serverError(err);
            console.log(files);
            fileDest=files.pop()['fd'];
            PostSM.create({
                postTitle:postTitle,
                postCaption:postCaption,
                userpost:req.userData.id,
                postImage:fileDest,
            })
            .fetch()
            .then((result)=>{ 
                console.log(req.body, "sfgg");
                return res.status(201).json({
                    status:201,
                    data:result
                })  
            }).catch((err)=>{
                return res.status(500).json({
                    status:500,
                    error:err
                }) 
            })
        });
    },
    getPosts: function(req, res){
        const uid=req.params.id;
        PostSM.find({userpost:req.userData.id}).sort({createdAt:-1}).populate('userpost')
        .then((result)=>{
            if(result < 1){
                return res.status(500).json({
                    message: "No Post Yet"
                });
            }else{
                return res.status(200).json({
                    status: 200,
                    posts: result
                });
            }
        }).catch((err)=>{
            return res.status(500).json({
                status: 500,
                posts: err
            });
        })
    },

    likePost: function(req,res){
        const pid=req.params.pid;
        const uid=req.userData.id;

        LikeDisLikeSM.find().where({ postId : pid, userId : uid}).then((result)=>{
            if(result.length >= 1){
                console.log("<Ss", result);
                return res.status(200).json({
                    message: "You already like this post"
                });
            }else{
                LikeDisLikeSM.create({
                    postId:pid,
                    userId:uid
                })
                .fetch()
                .then((result)=>{
                    return res.status(200).json({
                        status: 200,
                        posts: result
                    });
                }).catch((err)=>{
                    return res.status(500).json({
                        status: 500,
                        posts: err
                    });
        
                })
            }
        })
        
    },
    dislikePost:function(req,res){
        const pid=req.params.pid;
        const uid=req.userData.id;
        LikeDisLikeSM.find().where({ postId : pid, userId : uid}).then((result)=>{
            if(result.length < 1){
                return res.status(200).json({
                    message: "You did't like post"
                });
            }else{
                LikeDisLikeSM.destroy({
                    postId:pid,
                    userId:uid
                })
                .fetch()
                .then((result)=>{
                    return res.status(200).json({
                        status: 200,
                        posts: result
                    });
                }).catch((err)=>{
                    return res.status(500).json({
                        status: 500,
                        posts: err
                    });  
        
                })
            }
        })
    },

    commentPost: function(req, res){
        const uid=req.userData.id
        const pid=req.params.pid;
        const comment= req.body.comment;
        

        CommentSM.create({
            userId:uid,
            postId:pid,
            comment:comment
        })
        .fetch()
        .then((result)=>{
            return res.status(201).json({
                status: 201,
                comment: result
            });
        })
        .catch((err)=>{
            return res.status(500).json({
                status: 500,
                posts: err
            });
        })
    }

};

