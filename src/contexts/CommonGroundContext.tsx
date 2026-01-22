import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { UserProfile, UserStatus, AggregatedSkill } from "@/types/common-ground";
import { checkedInUsers as mockUsers } from "@/data/mock-users";

interface CommonGroundContextType {
  // Current user
  currentUserStatus: UserStatus;
  setCurrentUserStatus: (status: UserStatus) => void;
  
  // Checked-in users
  checkedInUsers: UserProfile[];
  
  // Skill aggregation
  aggregatedSkills: AggregatedSkill[];
  
  // Filtering
  selectedSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  filteredUsers: UserProfile[];
  
  // Open users only
  openUsers: UserProfile[];

  // Selected user for Smart Match
  selectedUser: UserProfile | null;
  setSelectedUser: (user: UserProfile | null) => void;

  // Invite functionality
  sendInvite: (user: UserProfile) => void;
  lastInvitedUser: UserProfile | null;
}

const CommonGroundContext = createContext<CommonGroundContextType | undefined>(undefined);

export const CommonGroundProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserStatus, setCurrentUserStatus] = useState<UserStatus>("open");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [checkedInUsers] = useState<UserProfile[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [lastInvitedUser, setLastInvitedUser] = useState<UserProfile | null>(null);

  // Aggregate skills from all checked-in users
  const aggregatedSkills = useMemo(() => {
    const skillMap = new Map<string, { count: number; users: UserProfile[] }>();
    
    checkedInUsers.forEach((user) => {
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
  }, [checkedInUsers]);

  // Filter users by selected skill and "open" status
  const filteredUsers = useMemo(() => {
    if (!selectedSkill) return [];
    
    return checkedInUsers.filter(
      (user) => user.skills.includes(selectedSkill) && user.status === "open"
    );
  }, [checkedInUsers, selectedSkill]);

  // Get only users who are open for coffee
  const openUsers = useMemo(() => {
    return checkedInUsers.filter((user) => user.status === "open");
  }, [checkedInUsers]);

  // Send invite function
  const sendInvite = (user: UserProfile) => {
    setLastInvitedUser(user);
    // Reset after a short delay
    setTimeout(() => setLastInvitedUser(null), 3000);
  };

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
