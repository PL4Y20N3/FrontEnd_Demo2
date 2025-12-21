import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import CommunityWeatherChat from "@/components/chat/CommunityWeatherChat";
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const { messages, sendMessage } = useChat("hanoi");

  return (
    <CommunityWeatherChat
      cityName="Hà Nội"
      messages={messages}
      isAuthenticated={isAuthenticated}
      onSend={(text) => sendMessage(text, user)}
      onLogin={() => navigate("/login")}
    />
  );
};
