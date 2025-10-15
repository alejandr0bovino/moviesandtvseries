'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ModalSignInProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function ModalSignIn({ isOpen, onClose, title, message }: ModalSignInProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignIn = () => {
    router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    onClose();
  };

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p className="text-center">
                {message}
              </p>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={handleSignIn}>
                Sign in
              </Button>

              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
