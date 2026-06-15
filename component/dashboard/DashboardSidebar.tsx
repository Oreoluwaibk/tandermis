"use client";

import { getNickNames } from "@/utils/getNickname";
import { IUser } from "@/redux/action/auth";
import { HistoryCase } from "./types";
import { LogoutOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Drawer, Dropdown } from "antd";
import React from "react";

interface SidebarContentProps {
  user: IUser | null;
  history: HistoryCase[];
  activeCaseId: string | null;
  onSelectCase: (id: string) => void;
  onNewCase: () => void;
  onDeleteCase: (id: string) => void;
  onLogoutClick: () => void;
  onNavigate?: () => void;
}

export const SidebarContent = ({
  user,
  history,
  activeCaseId,
  onSelectCase,
  onNewCase,
  onDeleteCase,
  onLogoutClick,
  onNavigate,
}: SidebarContentProps) => {
  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : "Guest User";
  const displayEmail = user?.email ?? "guest@tandermis.com";

  const handleSelectCase = (id: string) => {
    onSelectCase(id);
    onNavigate?.();
  };

  const handleNewCase = () => {
    onNewCase();
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col">
      <h1 className="text-2xl font-extrabold text-[#121212]">Tandermis</h1>

      <div className="mt-8 flex-1 overflow-y-auto md:mt-10">
        <p className="mb-3 text-sm text-[#888888]">History</p>
        <ul className="flex flex-col gap-1">
          {history.length === 0 && (
            <li className="rounded-xl px-3 py-2 text-sm text-[#888888]">
              No cases yet
            </li>
          )}
          {history.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelectCase(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  activeCaseId === item.id
                    ? "bg-[#F0F0F0] text-[#121212]"
                    : "text-[#4F4F4F] hover:bg-[#FAFAFA]"
                }`}
              >
                <span>{item.label}</span>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "delete",
                        label: "Delete",
                        danger: true,
                        onClick: () => onDeleteCase(item.id),
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-[#E8E8E8]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreOutlined />
                  </span>
                </Dropdown>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Button
          type="primary"
          onClick={handleNewCase}
          className="h-12! w-full rounded-[40px]! text-base! font-medium!"
        >
          New Case
        </Button>

        <div className="flex items-center gap-3 rounded-2xl border border-[#E8E8E8] px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5D2FC] text-sm font-semibold text-[#1E1E1E]">
            {getNickNames(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#121212]">
              {displayName}
            </p>
            <p className="truncate text-xs text-[#888888]">{displayEmail}</p>
          </div>
          <button
            type="button"
            onClick={onLogoutClick}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#DC1111]"
            aria-label="Log out"
          >
            <LogoutOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

interface DashboardSidebarProps extends SidebarContentProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const DashboardSidebar = ({
  mobileOpen,
  onMobileClose,
  ...contentProps
}: DashboardSidebarProps) => {
  return (
    <>
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[260px] flex-col border-r border-[#E8E8E8] bg-white px-5 py-8 md:flex">
        <SidebarContent {...contentProps} />
      </aside>

      <Drawer
        title={null}
        placement="left"
        open={mobileOpen}
        onClose={onMobileClose}
        width={280}
        className="dashboard-drawer md:hidden!"
        styles={{
          body: { padding: "24px 20px", display: "flex", flexDirection: "column" },
        }}
      >
        <SidebarContent {...contentProps} onNavigate={onMobileClose} />
      </Drawer>
    </>
  );
};

export default DashboardSidebar;
