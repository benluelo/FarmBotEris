export const config = {
  db: {
    connectionString: "mongodb://localhost:27017/",
    connectionOptions: {
      useUnifiedTopology: true
    }
  },
  farminfo: {
    growTimes: {
      apple: 30000,
      orange: 300000,
      lemon: 900000,
      pear: 1800000,
      cherry: 3600000,
      peach: 5400000,
      mango: 10800000,
      melon: 16200000,
      grapes: 25200000,
      strawberry: 34200000,
      banana: 37800000,
      pineapple: 43200000
    }
  },
  ownersIDs: [
    "527729016849956874",
    "295255543596187650"
  ]
} as const