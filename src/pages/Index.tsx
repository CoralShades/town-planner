import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getDefaultNotebook } from "@/lib/api";
import { useSession } from "@/hooks/useSession";
import { TopBar } from "@/components/TopBar";
import { SourcesSidebar } from "@/components/SourcesSidebar";
import { ChatStream } from "@/components/ChatStream";
import { PermitDrawer } from "@/components/PermitDrawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText, Settings } from "lucide-react";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: sessionLoading } = useSession();
  const [sessionId, setSessionId] = useState<string>("");
  const [notebookId, setNotebookId] = useState<string>("");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => {
    const currentSessionId = searchParams.get("sessionId");
    if (currentSessionId) {
      setSessionId(currentSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setSearchParams({ sessionId: newSessionId });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const initializeNotebook = async () => {
      if (sessionLoading || !user) return;
      
      try {
        const defaultNotebookId = await getDefaultNotebook();
        setNotebookId(defaultNotebookId);
      } catch (error) {
        console.error('Failed to get default notebook:', error);
      }
    };
    
    initializeNotebook();
  }, [user, sessionLoading]);

  if (sessionLoading || !sessionId || !notebookId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      
      <div className="flex-1 grid grid-cols-[260px_1fr_340px] md:grid-cols-3 overflow-hidden">
        {/* Desktop Sources Sidebar */}
        <div className="hidden md:block">
          <SourcesSidebar notebookId={notebookId} />
        </div>
        
        {/* Mobile Sources Sheet */}
        <Sheet open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden fixed top-16 left-2 z-40">
              <FileText className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px]">
            <SourcesSidebar notebookId={notebookId} />
          </SheetContent>
        </Sheet>
        
        {/* Chat Stream */}
        <ChatStream sessionId={sessionId} />
        
        {/* Desktop Actions Sidebar */}
        <div className="hidden md:block">
          <PermitDrawer sessionId={sessionId} />
        </div>
        
        {/* Mobile Actions Sheet */}
        <Sheet open={actionsOpen} onOpenChange={setActionsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden fixed top-16 right-2 z-40">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-[300px]">
            <PermitDrawer sessionId={sessionId} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Index;
