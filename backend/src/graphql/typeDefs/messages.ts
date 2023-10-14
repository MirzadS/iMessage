import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    messages(conversationId: String): [Message]
  }

  type Mutation {
    sendMessage(
      id: String
      conversationId: String
      senderId: String
      body: String
    ): Boolean
  }

  type Subscription {
    messageSent(conversationId: String): Message
  }

  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }
`;

export default typeDefs;
