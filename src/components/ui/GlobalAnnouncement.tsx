import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, PartyPopper } from "lucide-react";

export const GlobalAnnouncement = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has seen this specific announcement
        // Using a version key like 'announcement-v1-seen'
        const hasSeen = localStorage.getItem("mindgarden-announcement-v1");

        // Show after a short delay if not seen
        if (!hasSeen) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("mindgarden-announcement-v1", "true");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md border-amber-500/20 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <div className="mx-auto bg-amber-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <PartyPopper className="h-6 w-6 text-amber-500" />
                    </div>
                    <DialogTitle className="text-center text-xl font-serif">Welkom in het nieuwe MindGarden!</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        We hebben ons platform vernieuwd met een compleet nieuwe ervaring.
                        Ontdek de nieuwe <b>Mindfulness Labs</b>, connect met andere professionals en bekijk je vernieuwde profiel.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center">
                        <Sparkles className="w-5 h-5 text-neon-cyan mx-auto mb-2" />
                        <div className="text-xs font-medium">Nieuwe Design</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-center">
                        <div className="font-serif italic text-lg text-amber-500 mb-1">M</div>
                        <div className="text-xs font-medium">Premium Leden</div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleClose} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                        Start de Tour
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
