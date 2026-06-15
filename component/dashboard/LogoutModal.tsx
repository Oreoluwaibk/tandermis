"use client";

import { Button, Modal } from "antd";
import React from "react";

interface LogoutModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const LogoutModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
}: LogoutModalProps) => (
  <Modal
    open={open}
    onCancel={onCancel}
    footer={null}
    centered
    width={480}
    classNames={{ body: "px-6! py-8!" }}
  >
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-[#121212]">
        Are you sure you want to log out?
      </h3>
      <p className="text-sm leading-relaxed text-[#4F4F4F]">
        Logging out will sign you out of your Tandermis account. Any unsaved
        changes on this form will be lost. You can always log back in later.
      </p>
      <div className="mt-4 flex gap-3">
        <Button
          onClick={onConfirm}
          loading={loading}
          className="h-12! flex-1 rounded-[40px]! border-[#DC1111]! text-[#DC1111]! text-base!"
        >
          Log Out
        </Button>
        <Button
          type="primary"
          onClick={onCancel}
          className="h-12! flex-1 rounded-[40px]! text-base!"
        >
          Stay logged in
        </Button>
      </div>
    </div>
  </Modal>
);

export default LogoutModal;
