const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/Usermodel')
const multer = require('multer')
const path = require('path')
const fs = require('fs');

// const NODE_ENV = 'development'

JWT_SECRET = "shawarmawithhummus"


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + file.originalname.split('.')[0];
        const fileExt = path.extname(file.originalname);
        cb(null, req.user.id + '-' + unique + fileExt);
    }
});

const uploadMiddleware = multer({ storage })


const registerUser = asyncHandler(async (req, res) => {
    const { name, age, username, email, password, phnum } = req.body

    const userExists = await User.findOne({ email })
    const usernameExists = await User.findOne({ username })
    if (userExists) {
        res.status(400)
        throw new Error('User exists')
    }
    if (usernameExists) {
        res.status(400)
        throw new Error('Username taken')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        age,
        username,
        email,
        password: hashedPass,
        phnum,
    })
    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else {
        res.status(400)
        throw new Error('User invalid')
    }
})
// pass: 723hshds
//username: muzzz1
//email: mam77am@gmail.com
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else { 
        res.status(401);
        throw new Error('Credentials invalid')
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: 'User logged out' })
})

const userData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('_id username bio name email userPFP');
    res.status(200).json(user)
})


const deletepfp = (pfp) => {
    fs.unlink(pfp, (err) => {
        if(err){
            console.error('Error deleting pfp:', err);
        } else {
            // console.log(pfp)
            console.log('pfp deleted');
        }
    });
}
const updateprof = asyncHandler(async (req, res) => {
    
    uploadMiddleware.single('file')(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to upload file.' });
        }
        // console.log(req.user.id, req.file, req.body);
        // console.log(req.file); 
        const user = await User.findById(req.user.id);
        const pfp = req.file? req.file.path : null;
        // console.log(pfp, user.userPFP);
        if(user.userPFP && pfp){ 
            deletepfp(user.userPFP);
        }
        if (user) { 
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.phnum = req.body.phnum || user.phnum;
            user.userPFP = pfp ? pfp : user.userPFP;
            const updatedUser = await user.save();
            if(updatedUser){
                res.status(200).json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    bio: updatedUser.bio,
                    username: updatedUser.username,
                    phnum: updatedUser.phnum,
                    pfp: updatedUser.userPFP,
                });
            } else{
                res.status(400);
                throw new Error('Update failed');
            }
            // console.log(updatedUser)
        } else {
            res.status(400);
            throw new Error('User not found.');
        }
    });
});

// const updateprof = asyncHandler(async (req, res) => {
//         console.log(req.user.id, req.body);
//         const user = await User.findById(req.user.id);
//         const pfp = req.file ? req.file.path : null;
//         console.log(pfp);
//         if(req.file){
//             uploadMiddleware.single('file')(req, res, async (err) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).json({ error: 'Failed to upload file.' });
//                 }
//             });
//         }
//         if (user) {
//             user.name = req.body.name || user.name;
//             user.bio = req.body.bio || user.bio;
//             user.username = req.body.username || user.username;
//             user.email = req.body.email || user.email;
//             user.phnum = req.body.phnum || user.phnum;
//             user.userPFP = pfp ? pfp : user.pfp;
//             const updatedUser = await user.save();
//             res.status(200).json({
//                 _id: updatedUser._id,
//                 name: updatedUser.name,
//                 email: updatedUser.email,
//                 bio: updatedUser.bio,
//                 username: updatedUser.username,
//                 phnum: updatedUser.phnum,
//                 pfp: updatedUser.userPFP,
//             });
//             // console.log(updatedUser)
//         } else {
//             res.status(400);
//             throw new Error('User not found.');
//         }
    
// });

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        // secure: NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
}



module.exports = {
    registerUser,
    loginUser,
    userData,
    logoutUser,
    updateprof,
}