/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { MessagesData, MessagesSubscriptionData, MessagesVariables } from "../../../../util/types";
import MessageOperations from "../../../../graphql/operations/messages";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../../../common/SkeletonLoader";
import { useEffect } from "react";
import MessageItem from "./MessageItem";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore, refetch } = useQuery<MessagesData, MessagesVariables>(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onCompleted: (data) => {
      refetch();
    },
    fetchPolicy: "cache-first",

    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: MessageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },

      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        console.log("Messages.tsx - unutar updateQuery");

        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;
        console.log("Messages.tsx - newMessage: ", newMessage);

        return Object.assign({}, prev, {
          messages: newMessage.sender.id === userId ? prev.messages : [newMessage, ...prev.messages],
        });
      },
    });
    return () => unsubscribe();
  }, [conversationId]);

  if (error) {
    return null;
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItem message={message} sentByMe={message.sender.id === userId} key={message.id} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
