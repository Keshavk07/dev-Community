const express =require('express');
const router=express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
    '/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      
      }
      
    // destructure the request
    const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        status,
        bio,
        githubusername,
        company,
        location,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;
      // Build profile object
      const profileFields={};
      profileFields.user=req.user.id;
      if(company) profileFields.company=company;
      if(website) profileFields.website=website;
      if(location) profileFields.location=location;
      if(bio) profileFields.bio=bio;
      if(status) profileFields.status=status;
      if(githubusername) profileFields.githubusername=githubusername;
      if(skills){
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
      }

       // Build socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };
    
    profileFields.social={};
    if(youtube) profileFields.youtube=youtube;
    if(twitter) profileFields.twitter=twitter;
    if(facebook) profileFields.facebook=facebook;
    if(linkedin) profileFields.linkedin=linkedin;
    if(instagram) profileFields.instagram=instagram;
    
    try {
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            profile=await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields },
                {new : true}
            );
            return res.json(profile);
        }
        // Create
        profile= new Profile(profileFields);
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
      console.log(profileFields.skills);
      res.send('hello dark backend');
    });

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
// router.get('/', async (req, res) => {
//   try {
//     const profiles = await Profile.find().populate('user', ['name', 'avatar']);
//     res.json(profiles);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ msg: 'No profiles found' });
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/user/:user_id',
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id
      }).populate('user', ['name', 'avatar']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);
// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    await Profile.findOneAndDelete({user: req.user.id});
    // Remove user
   await User.findOneAndDelete({_id: req.user.id});

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [auth,
    [
  check('title', 'Title is required').notEmpty(),
  check('company', 'Company is required').notEmpty(),
  check('from', 'From date is required and needs to be from the past')
    .notEmpty()
    ]
  ],
    
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }= req.body;

    const newExp={
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });

    foundProfile.experience = foundProfile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );

    await foundProfile.save();
    return res.status(200).json(foundProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});


// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [auth,
    [
  check('school', 'School is required').notEmpty(),
  check('degree', 'Degree is required').notEmpty(),
  check('fieldofstudy', 'Field of study is required')
    .notEmpty(),
    check('from', 'From date is required')
    .notEmpty()
    ]
  ],
    
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }= req.body;

    const newEdu={
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    // Get remove index

    const removeIndex= profile.education.map(item=>item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex,1);
    await profile.save();
    return res.status(200).json(profile);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});



module.exports=router;