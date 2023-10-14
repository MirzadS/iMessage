import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationModal from "./Modal/Modal";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useMutation } from "@apollo/client";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean | undefined) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ session, conversations, onViewConversation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConversation] = useMutation<{ deleteConversation: boolean; conversationId: string }>(
    ConversationOperations.Mutations.deleteConversation
  );

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const { id: userId } = session.user;

  const onDeleteConversation = async (conversationId: string) => {
    console.log("ConIDDD", conversationId);
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(typeof process.env.NEXT_PUBLIC_BASE_URL === "string" ? process.env.NEXT_PUBLIC_BASE_URL : "");
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error: any) {
      console.log("onDeleteConversation error", error);
    }
  };

  const sortedConversations = [...conversations].sort(function (a, b) {
    let a1 = new Date(a.updatedAt);
    let b1 = new Date(b.updatedAt);

    return b1.getTime() - a1.getTime();
  });

  return (
    <Box width="400px" position="relative" height="100%">
      <Box py={2} px={4} mb={4} bg="blackAlpha.300" borderRadius={4} cursor="pointer" onClick={onOpen}>
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {sortedConversations.map((conversation) => {
        const participant = conversation.participants.find((p) => p.user.id === userId);

        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() => onViewConversation(conversation.id, participant?.hasSeenLatestMessage)}
            onDeleteConversation={onDeleteConversation}
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            isSelected={conversation.id == router.query.conversationId}
          />
        );
      })}
      <Box position="absolute" bottom={0} left={0} width="100%" bg="#313131" px={8} py={6} zIndex={1}>
        <Button width="100%" onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationList;
