import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): createConversationResponse
    markConversationAsRead(userId: String!, conversationId: String): Boolean
    deleteConversation(conversationId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
    conversationUpdated: ConversationUpdatedSubscriptionPayload
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }

  type ConversationDeletedSubscriptionPayload {
    id: String
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type createConversationResponse {
    conversationId: String
  }
`;

export default typeDefs;
