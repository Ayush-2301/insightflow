"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";

export const AlertModal: React.FC = () => {
  const router = useRouter();

  function onConfirm() {
    router.push("/");
  }
  function onClose() {
    router.push("/watchlist");
  }
  return (
    <>
      <Modal
        title="Complete Your Company Profile"
        description="To start creating your first watchlist, please complete your company profile. This information is required to proceed."
        isOpen={true}
        onClose={onClose}
      >
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Continue</Button>
        </div>
      </Modal>
    </>
  );
};
