/*
STUB DATA
We're currently migrating our database and have an outstanding issue w/ joins
(populate() in mongoose) working in theory, but having null associations.
Stub data can be imported and assigned to an object in render() to simulate real data.
*/

const user = {
  name: 'Ryan Keller',
  netID: 'rykeller',
  email: 'rykeller@udub.edu',
  committee: {
    spectator: true,
    member: true,
    admin: true
  }
}

const contact = {
  role: 'primary',
  name: 'name',
  netID: 'rykeller',
  title: 'Web Developer',
  email: 'email here',
  phone: 8000999899,
  mailbox: '30150'
}

const decision = {
  date: Date.now,
  body: 'Enjoy your money, etc.',
  author: user,
  approved: true,
  grant: 100000,
  reviews: [review, review],
  report
}

const report = {
  date: Date.now,
  proposal
}

const review = {
  date: Date.now,
  decision,
  user,
  score: 80,
  ratings: [
    {
      prompt: 'Awful question',
      score: 60
    },
    {
      prompt: 'Good question',
      score: 90
    }
  ],
  body: 'I like this proposal because X, Y, Z',
  approve: true
}
const project = {
  overview: {
    abstract: 'my abstract',
    objectives: 'some text on objectives',
    justification: 'justification here',
    impact: {
      academic: 'Academic impact.',
      research: 'Research impact.',
      career: 'Career building opportunities.'
    }
  },
  plan: {
    state: {
      current: 'current state',
      future: 'future state'
    },
    availability: {
      current: 'current state',
      future: 'future state'
    },
    strategy: {
      current: 'current state',
      future: 'future state'
    },
    outreach: {
      current: 'current state',
      future: 'future state'
    },
    risk: {
      current: 'current state',
      future: 'future state'
    }
  }
}
const legacy = [
  {
    title: 'Legacy Question 1'
    body: 'User response'
  },
  {
    title: 'Some really bad question',
    body: 'The retort'
  }
]
const item = {}
const manifest = {}
const amendment = {}
const comment = {}

const block = {}
const proposal = {}

// const ENV = process.env.NODE_ENV
// const API = (process.env.NODE_ENV === 'development'
//   ? 'http://localhost:3000'
//   : 'https://demo-reactgo.herokuapp.com'
// )
// const version = process.env.VERSION || 'v1'
//
// export { ENV, API, version }
// export default { ENV, API, version }
