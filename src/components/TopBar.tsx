import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { HistoryDrawer } from "./HistoryDrawer";
import { HeaderNewChatButton } from "./NewChatButton";
import { useSessionManager } from "@/lib/session-management";

interface TopBarProps {
  onClearChats?: () => void;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
  notebookId?: string;
}

// Generate random avatar background color and emoji
const getRandomAvatarStyle = () => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-emerald-500'
  ];
  
  const emojis = ['🌟', '🚀', '🎯', '🌈', '⭐', '🔥', '💎', '🎨', '🌸', '🦋', '🌺', '🎭'];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  return { color: randomColor, emoji: randomEmoji };
};

export const TopBar = ({ onClearChats, onSessionSelect, onNewSession, notebookId }: TopBarProps) => {
  const { createNewSession } = useSessionManager();
  const [avatarStyle] = useState(getRandomAvatarStyle());

  const handleClearChats = () => {
    onClearChats?.();
    toast("Chat history cleared");
  };

  const handleProfileClick = () => {
    toast("Profile settings coming soon");
  };

  const handleSessionSelect = (sessionId: string) => {
    onSessionSelect?.(sessionId);
  };

  const handleNewSession = async () => {
    try {
      const newSessionId = await createNewSession(notebookId);
      onNewSession?.();
      toast("New chat session created");
    } catch (error) {
      console.error('Failed to create new session:', error);
      toast("Failed to create new session", { description: "Please try again" });
    }
  };

  return (
    <div className="h-14 bg-background border-b flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Left - History Drawer */}
      <div className="flex items-center gap-3">
        <HistoryDrawer onSessionSelect={handleSessionSelect} />
        <HeaderNewChatButton
          notebookId={notebookId}
          onNewSession={handleNewSession}
          currentSessionId={undefined} // TopBar doesn't track current session
          showConfirmation={false} // Skip confirmation in header for quick access
          label="New Chat"
        />
      </div>

      {/* Center - Title */}
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" alt="Human Habitat" className="w-5 h-5" />
        <h1 className="text-lg font-semibold text-foreground hidden sm:block">
          Human Habitat Assistant
        </h1>
        <h1 className="text-lg font-semibold text-foreground sm:hidden">
          Habitat Assistant
        </h1>
      </div>

      {/* Right - Avatar Only */}
      <div className="flex items-center gap-3">
        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${avatarStyle.color} text-white text-sm`}>
                  {avatarStyle.emoji}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-50">
            <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClearChats} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chats
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};