const { UserB } = require('./model')


exports.getUserById = id => new UserB({id})
  .fetch()
  .then(function(model) {
    // outputs 'Slaughterhouse Five'
    console.log('lajdlfkajsldfjasklf')
    console.log(model.get('username'));
  });


exports.getUserByUsername = username => new UserB({username})
  .fetch()
  .then(function(model) {
      console.log('qqqlajdlfkajsldfjasklf')
    // outputs 'Slaughterhouse Five'
    console.log(model.get('username'));
  });


// new UserB({id})
//   .fetch()
//   .then(function(model) {
//     // outputs 'Slaughterhouse Five'
//     console.log(model.get('title'));
//   });


// new UserB({username})
//             .fetch()
//             .tap((user) => {
//                 return bcryptB.compareAsync(password, user.get('password'))
//                     .then((valid) => {
//                         if (!valid) throw new Error('Invalid password')
//                     })
//             })


// exports.getUserById = id => User.findOne({
//     where: { id },
// })

// exports.getUserByUsername = username => User.findOne({
//     where: { username },
// })
