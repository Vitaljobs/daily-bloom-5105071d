import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback, useEffect } from "react";
import { UserProfile, UserStatus, AggregatedSkill } from "@/types/common-ground";
import { checkedInUsers as mockUsers } from "@/data/mock-users";
import { labs, Lab, getLabById } from "@/data/labs";
import { useSearchParams } from "react-router-dom";

interface CommonGroundContextType {
  // Current user
  currentUserStatus: UserStatus;
  setCurrentUserStatus: (status: UserStatus) => void;
  
  // Checked-in users
  checkedInUsers: UserProfile[];
  
  // Skill aggregation (filtered by lab)
  aggregatedSkills: AggregatedSkill[];
  
  // Filtering
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  filteredUsers: UserProfile[];
  
  // Open users only (filtered by lab)
  openUsers: UserProfile[];

  // Selected user for Smart Match
  selectedUser: UserProfile | null;
  setSelectedUser: (user: UserProfile | null) => void;

  // Invite functionality
  sendInvite: (user: UserProfile) => void;
  lastInvitedUser: UserProfile | null;

  // Match reveal
  showMatchReveal: boolean;
  matchedUser: UserProfile | null;
  triggerMatchReveal: (user: UserProfile) => void;
  closeMatchReveal: () => void;

  // Location
  currentLocation: string;
  setCurrentLocation: (locationId: string) => void;
  isChangingLocation: boolean;
  currentLab: Lab | undefined;
  usersPerLab: Record<string, number>;

  // Welcome overlay
  showWelcome: boolean;
  closeWelcome: () => void;
  visitedLabs: Set<string>;

  // QR Check-in
  isQRCheckIn: boolean;
  showQRWelcome: boolean;
  closeQRWelcome: () => void;

  // Chat
  isChatOpen: boolean;
  chatPartner: UserProfile | null;
  openChat: (user: UserProfile) => void;
  closeChat: () => void;
  endChatSession: () => void;
  hasActiveChat: boolean;
}

const CommonGroundContext = createContext<CommonGroundContextType | undefined>(undefined);

export const CommonGroundProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUserStatus, setCurrentUserStatus] = useState<UserStatus>("open");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [checkedInUsers] = useState<UserProfile[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [lastInvitedUser, setLastInvitedUser] = useState<UserProfile | null>(null);
  
  // Match reveal state
  const [showMatchReveal, setShowMatchReveal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  // Location state
  const [currentLocation, setCurrentLocationState] = useState("roastery");
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  // Welcome overlay state
  const [showWelcome, setShowWelcome] = useState(true);
  const [visitedLabs, setVisitedLabs] = useState<Set<string>>(new Set());

  // QR Check-in state
  const [isQRCheckIn, setIsQRCheckIn] = useState(false);
  const [showQRWelcome, setShowQRWelcome] = useState(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [hasActiveChat, setHasActiveChat] = useState(false);

  // Handle QR deep-link on mount
  useEffect(() => {
    const labParam = searchParams.get("lab");
    if (labParam) {
      const lab = getLabById(labParam);
      if (lab) {
        // Check if this is a first-time QR check-in
        const qrCheckIns = localStorage.getItem("cg-qr-checkins");
        const previousCheckIns: string[] = qrCheckIns ? JSON.parse(qrCheckIns) : [];
        const isFirstQRCheckIn = !previousCheckIns.includes(labParam);

        if (isFirstQRCheckIn) {
          setIsQRCheckIn(true);
          setShowQRWelcome(true);
          // Save this check-in
          localStorage.setItem("cg-qr-checkins", JSON.stringify([...previousCheckIns, labParam]));
        }

        // Set the location
        setCurrentLocationState(labParam);
        setVisitedLabs((prev) => new Set([...prev, labParam]));
        setShowWelcome(false); // Don't show regular welcome for QR
        
        // Clear the URL param
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  // Current lab
  const currentLab = useMemo(() => getLabById(currentLocation), [currentLocation]);

  // Users per lab count
  const usersPerLab = useMemo(() => {
    const counts: Record<string, number> = {};
    labs.forEach((lab) => {
      counts[lab.id] = checkedInUsers.filter(
        (user) => user.labId === lab.id && user.status !== "invisible"
      ).length;
    });
    return counts;
  }, [checkedInUsers]);

  // Users in current lab (excluding invisible)
  const usersInCurrentLab = useMemo(() => {
    return checkedInUsers.filter(
      (user) => user.labId === currentLocation && user.status !== "invisible"
    );
  }, [checkedInUsers, currentLocation]);

  // Aggregate skills from users in current lab
  const aggregatedSkills = useMemo(() => {
    const skillMap = new Map<string, { count: number; users: UserProfile[] }>();
    
    usersInCurrentLab.forEach((user) => {
      user.skills.forEach((skill) => {
        const existing = skillMap.get(skill) || { count: 0, users: [] };
        skillMap.set(skill, {
          count: existing.count + 1,
          users: [...existing.users, user],
        });
      });
    });

    return Array.from(skillMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        users: data.users,
      }))
      .sort((a, b) => b.count - a.count);
  }, [usersInCurrentLab]);

  // Filter users by selected skill and "open" status in current lab
  const filteredUsers = useMemo(() => {
    if (!selectedSkill) return [];
    
    return usersInCurrentLab.filter(
      (user) => user.skills.includes(selectedSkill) && user.status === "open"
    );
  }, [usersInCurrentLab, selectedSkill]);

  // Get only users who are open for coffee in current lab
  const openUsers = useMemo(() => {
    return usersInCurrentLab.filter((user) => user.status === "open");
  }, [usersInCurrentLab]);

  // Send invite function
  const sendInvite = (user: UserProfile) => {
    setLastInvitedUser(user);
    // Reset after a short delay
    setTimeout(() => setLastInvitedUser(null), 3000);
  };

  // Match reveal functions
  const triggerMatchReveal = useCallback((user: UserProfile) => {
    setMatchedUser(user);
    setShowMatchReveal(true);
  }, []);

  const closeMatchReveal = useCallback(() => {
    setShowMatchReveal(false);
    setTimeout(() => {
      setMatchedUser(null);
      // Open chat after match reveal closes
      if (matchedUser) {
        setChatPartner(matchedUser);
        setIsChatOpen(true);
        setHasActiveChat(true);
      }
    }, 500);
  }, [matchedUser]);

  // Location change with animation trigger and welcome overlay
  const setCurrentLocation = useCallback((locationId: string) => {
    setIsChangingLocation(true);
    setTimeout(() => {
      setCurrentLocationState(locationId);
      
      // Show welcome if not visited before
      if (!visitedLabs.has(locationId)) {
        setShowWelcome(true);
        setVisitedLabs((prev) => new Set([...prev, locationId]));
      }
      
      setTimeout(() => {
        setIsChangingLocation(false);
      }, 100);
    }, 400);
  }, [visitedLabs]);

  // Close welcome overlay
  const closeWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  // Close QR welcome animation
  const closeQRWelcome = useCallback(() => {
    setShowQRWelcome(false);
    setIsQRCheckIn(false);
  }, []);

  // Chat functions
  const openChat = useCallback((user: UserProfile) => {
    setChatPartner(user);
    setIsChatOpen(true);
    setHasActiveChat(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const endChatSession = useCallback(() => {
    setIsChatOpen(false);
    setChatPartner(null);
    setHasActiveChat(false);
    setSelectedUser(null);
  }, []);

  return (
    <CommonGroundContext.Provider
      value={{
        currentUserStatus,
        setCurrentUserStatus,
        checkedInUsers,
        aggregatedSkills,
        selectedSkill,
        setSelectedSkill,
        filteredUsers,
        openUsers,
        selectedUser,
        setSelectedUser,
        sendInvite,
        lastInvitedUser,
        showMatchReveal,
        matchedUser,
        triggerMatchReveal,
        closeMatchReveal,
        currentLocation,
        setCurrentLocation,
        isChangingLocation,
        currentLab,
        usersPerLab,
        showWelcome,
        closeWelcome,
        visitedLabs,
        isQRCheckIn,
        showQRWelcome,
        closeQRWelcome,
        isChatOpen,
        chatPartner,
        openChat,
        closeChat,
        endChatSession,
        hasActiveChat,
      }}
    >
      {children}
    </CommonGroundContext.Provider>
  );
};

export const useCommonGround = () => {
  const context = useContext(CommonGroundContext);
  if (!context) {
    throw new Error("useCommonGround must be used within a CommonGroundProvider");
  }
  return context;
};
