import mongoose from 'mongoose'
import faker from 'faker'

const CommentSchema = new mongoose.Schema({
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //  Default titles since this is a new feature
  title: { type: String, required: true, default: '' },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }

})
const Comment = mongoose.model('Comment', CommentSchema)
export default Comment

/* *****
FAKE DATA GENERATOR: Comment
***** */
const dummyComments = (min) => {
  //  Check the db for existing data satisfying min required
  Comment.count().exec((err, count) => {
    if (err) {
      console.warn(`Unable to count Comment schema: ${err}`)
    } else if (count < min) {
      //  If it didn't, inject dummies.
      let fakes = []
      for (let i = 0; i < min; i++) {
        fakes[i] = new Comment({
          proposal: new mongoose.Types.ObjectId(),  // THIS IS RANDOM
          user: new mongoose.Types.ObjectId(),
          title: faker.company.catchPhrase(),
          body: faker.lorem.paragraph(),
          date: faker.date.recent()
        })
      }
      //  Create will push our fakes into the DB.
      Comment.create(fakes, (error) => {
        if (!error) { console.log(`SEED: Created fake Comment (${fakes.length})`) }
      })
    }
  })
}

export { dummyComments }
