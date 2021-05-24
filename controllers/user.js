const Web3 =require ('web3')
const User = require('../models/user')

//  find the user and if not create one. do that in one route
// 

exports.getUser = async (req, res, next) => {
  try {
    const publicAddress = req.params.publicAddress
    let user = await User.findOne({ publicAddress: publicAddress })
    if (!user) {
      const newUser = new User({
        nonce: Math.floor(Math.random() * 10000),
        publicAddress: publicAddress,
        username: '', // later make a uniquie name
        role: 'user',
      })
      user = await newUser.save()
    }
    return res.json({
      nonce: user.nonce,
      publicAddress: user.publicAddress,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Internal Error' })
  }
}

exports.get = async (req, res, next) => {
  try {
    if (req.user.payload.id !== req.params.userId) {
      return res.status(401).send({ error: 'You can can only access yourself' })
    }
    const user = await User.findById(req.params.userId)
    if (user) {
      return res.json(user)
    }
    //what to do it null
    console.log('user null')
    return res.json(user)
  } catch (err) {
    console.log(err)
    next()
  }
}

exports.patch = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)
    if (!user) {
      return res.status(401).send({ error: 'invalid id' })
    }
    const {
      username,
      email,
      fullname,
      bio,
      coverImg,
      avatar,
      instagram,
      facebook,
      youtube,
      tiktok,
    } = req.body

    if(user.username != username){
        const doesUserExit = await User.exists({ username: username })
        console.log(doesUserExit)
    
        if (doesUserExit) {
          return res.status(401).send({
            error: 'Username Taken',
          })
        }
    }


    user.username = username
    user.fullname = fullname
    user.email = email
    user.bio = bio
    user.coverImg = coverImg
    user.avatar = avatar
    user.instagram = instagram
    user.facebook = facebook
    user.youtube = youtube
    user.tiktok = tiktok
    if(user.username !== '') {
      user.role= "creator"
    }

    let savedUser = await user.save()
    return res.status(200).send(savedUser)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}


exports.followCreator = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)

    if (!user) {
      return res.status(401).send({ error: 'invalid id' })
    }

    let followCreator = req.body.creator

    const creator = await User.findOne({publicAddress: followCreator})
    if(!creator){
      return res.status(400).send({message: "no creator found"})
    }

    let following = user.following
    let followers  =  creator.followers

    let isFollowing = false
    //check if following
    following.forEach((_creator)=>{
      if(_creator === followCreator){
        isFollowing = true
      }
    })

    if(isFollowing){
      following = following.filter((_creator)=> _creator !== followCreator)
      followers = followers.filter((_follower)=> _follower !== user.publicAddress)
    }else{
      following.push(followCreator)
      followers.push(user.publicAddress)
    }


    user.following = following
    user.markModified("following")

    creator.followers = followers
    creator.markModified("followers")

    await creator.save()
    await user.save()
    
    return res.status(200).send({creator, user})

  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }

}

// exports.beCreators = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.payload.id)
//     user.role= 'creator'
//     await user.save()
   
//     return res.status(200).send(user)

//   } catch (err) {
//     console.log(err)
//     return res.status(500).send({
//       error: `Internal Error`,
//     })
//   }
// }



exports.getCreators = async (req, res) => {
  try {
    const creator = await User.find({role: 'creator'}) // add a role
    return res.status(200).send(creator)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}

exports.getByUsername = async (req, res) => {
  try {
    let username = req.body.username
    let searchBy = "username"
   if( Web3.utils.isAddress(username)){
     searchBy = "publicAddress"
   }
    const creator = await User.findOne({ [searchBy]:  username})
    if(!creator){
      return res.status(400).send({message: 'no user found'})
    }
    return res.status(200).send(creator)
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      error: `Internal Error`,
    })
  }
}
