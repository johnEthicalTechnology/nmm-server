export default {
  Query: {
    articles: async (
      _: any,
      __: any,
      { dataSources }: { dataSources: any }
    ) => {
      const result = await dataSources.articleAPI.getArticles()
      return result
    }
  },
  Mutation: {
    createArticles: (
      _: any,
      { articles }: { articles: any },
      { dataSources }: { dataSources: any }
    ) => {
      return dataSources.articleAPI.createArticles({ articles })
    },
    createArticle: (
      _: any,
      { article }: { article: any },
      { dataSources }: { dataSources: any }
    ) => {
      return dataSources.articleAPI.createArticle({ article })
    }
  }
}
