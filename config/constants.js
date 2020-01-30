module.exports = {
  JOI: {
    property: {
      body: 'body',
      params: 'params',
      query: 'query',
    },
  },

  userType: {
    admin: 'ADMIN',
    member: 'MEMBER',
    author: 'AUTHOR',
  },

  bookType: {
    general: 'GENERAL',
    science: 'SCIENCE',
    law: 'LAW',
    religious: 'RELIGIOUS',
  },

  bookRequestStatus: {
    pending: 'PENDING',
    approve: 'APPROVE',
    reject: 'REJECT',
  },
};
