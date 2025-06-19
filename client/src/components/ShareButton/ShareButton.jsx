// ShareButton.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoShareSocial } from "react-icons/io5";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import { ShareModal } from "../modals/ShareModal";

const ShareButton = ({ contentRef, taskName = "", streak = 0 }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreenshot = async () => {
    if (contentRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const dataUrl = await toPng(contentRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          filter: (node) => {
            return !node.classList?.contains("share-button");
          },
        });

        setScreenshotUrl(dataUrl);
        setShowShareModal(true);
        toast.success("Screenshot captured successfully!");
      } catch (error) {
        console.error("Screenshot failed:", error);
        toast.error("Failed to generate image. Please try again.");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={captureScreenshot}
        disabled={isCapturing}
        className={`
          share-button
          fixed top-4 right-4 md:top-6 md:right-6 
          bg-orange-500 text-white 
          px-3 py-2 md:px-4 md:py-2
          text-sm md:text-base
          rounded-lg flex items-center gap-2 
          hover:bg-orange-600 transition-colors 
          shadow-lg z-50
          ${isCapturing ? "opacity-75 cursor-not-allowed" : ""}
        `}
      >
        <IoShareSocial className="w-4 h-4 md:w-5 md:h-5" />
        {isCapturing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Capturing...
          </div>
        ) : (
          "Share"
        )}
      </motion.button>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            onClose={() => {
              setShowShareModal(false);
              setScreenshotUrl(null);
            }}
            imageUrl={screenshotUrl}
            taskName={taskName}
            streak={streak}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;
