import userResolvers from "./user";
import conversationResolvers from "./conversation";
import messageResolvers from "./messages";
import merge from "lodash.merge";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers
);

export default resolvers;
